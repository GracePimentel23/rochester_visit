const CACHE_NAME = "visit-app-cache-v2";
const DATA_CACHE_NAME = "data-cache";
const BASE_URL = "/~gp3326/252/localStorage";

const FILES_TO_CACHE = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/favs.html`,
  `${BASE_URL}/info.html`,
  `${BASE_URL}/visit.css`,
  `${BASE_URL}/json.js`,
  `${BASE_URL}/favs.js`,
  `${BASE_URL}/info.js`
];


self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell");
      return cache.addAll(FILES_TO_CACHE).catch((error) => {
        console.error("Failed to cache files:", error);
        FILES_TO_CACHE.forEach(async (file) => {
          try {
            await cache.add(file);
            console.log(`[Service Worker] Cached: ${file}`);
          } catch (err) {
            console.error(`[Service Worker] Failed to cache: ${file}`, err);
          }
        });
        throw error;
      });
    })
  );
  self.skipWaiting();
});


self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});


self.addEventListener("fetch", (evt) => {
  if (evt.request.url.includes("visit.json")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) =>
        fetch(evt.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(evt.request))
      )
    );
  } else {
    evt.respondWith(
      caches.match(evt.request).then((response) => response || fetch(evt.request))
    );
  }
});
