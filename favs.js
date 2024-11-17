const xhr = new XMLHttpRequest();
const url = "visit.json";

xhr.addEventListener("load", function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const Places = JSON.parse(xhr.responseText);
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let output = `<h1 class="title">My Favorite Places</h1>
                      <a href="index.html" class="btn2">&#8592; Back</a>`;

        function displayFavorites() {
            const favoritesContainer = document.getElementById("favList");

            for (const favoriteId of storedFavorites) {
                const favoritePlace = Places.find(place => place.id === favoriteId);
                if (favoritePlace) {
                    output += placeTemplate(favoritePlace); 
                }
            }

            favoritesContainer.innerHTML = output;
        }

        displayFavorites();
    }
});

xhr.open("GET", url, true);
xhr.send();

function placeTemplate(place) {
    return `
        <div class="place">
            <img class="place-photo" src="${place.image}">
            <h2 class="place-name">${place.name}</h2>
            <p class="place-address">Address: ${place.location}</p>
            <p class="place-description">${place.description}</p>
        </div>`;
}
