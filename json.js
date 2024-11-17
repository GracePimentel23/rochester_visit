let Places = []; 
const xhr = new XMLHttpRequest();
const url = "visit.json";
let output = "";


xhr.addEventListener("load", function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        Places = JSON.parse(xhr.response); 
        console.log(Places); 

        for (let place of Places) {
            output += placeTemplate(place);
        }
        
        document.getElementById("display").innerHTML =
            `<h1 class="title">Top 10 Places to Visit in Rochester</h1>
            <a class="btn1" onclick="showFavorites()">Show Favorites</a>
            ${output}`;
    }
});

xhr.open("GET", url, true);
xhr.send();

function placeTemplate(place) {
    const isFavorite = isPlaceFavorite(place.id);
    const heartClass = isFavorite ? "fa fa-heart" : "far fa-heart";
    return `
        <div class="place">
            <div class="heart-name">
                <h2 class="place-name">${place.name}</h2>
                <i id="heart-${place.id}" class="${heartClass}" onclick="addOrRemoveFavorite(${place.id})"></i>
            </div>
            <img class="place-photo" src="${place.image}" alt="${place.name}">
            <button class="btn" onclick="showDetails(${place.id})">More Info</button>
        </div>`;
}


function showDetails(placeId) {
    const selectedPlace = Places.find(place => place.id === placeId); 
    if (selectedPlace) {
        const modalDetails = document.getElementById("modalDetails");
        modalDetails.innerHTML = `
            <h2>${selectedPlace.name}</h2>
            <img class="place-photo" src="${selectedPlace.photo}" alt="${selectedPlace.name}">
            <p><strong>Address:</strong> ${selectedPlace.location}</p>
            <p>${selectedPlace.description}</p>
        `;

        const modal = document.getElementById("infoModal");
        modal.style.display = "block";
    } else {
        console.error("Place not found with ID:", placeId);
    }
}


document.querySelector(".close-button").onclick = function() {
    document.getElementById("infoModal").style.display = "none";
};


window.onclick = function(event) {
    const modal = document.getElementById("infoModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


function isPlaceFavorite(placeId) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(placeId);
}

function showFavorites() {
    window.open("favs.html", "_self"); 
}

let favorites = [];

function addOrRemoveFavorite(placeId) {
    const heartIcon = document.getElementById(`heart-${placeId}`);
    if (heartIcon.className === "far fa-heart") {
        heartIcon.className = "fa fa-heart";
        addToFavorites(placeId);
    } else {
        heartIcon.className = "far fa-heart";
        removeFromFavorites(placeId);
    }
}

function addToFavorites(placeId) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(placeId)) {
        favorites.push(placeId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Added to favorites:", favorites);
    }
}


function removeFromFavorites(placeId) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.indexOf(placeId);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Removed from favorites:", favorites);
    }
}
