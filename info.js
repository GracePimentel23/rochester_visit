const xhr = new XMLHttpRequest();
const url = "visit.json"; 
let output = "";

xhr.addEventListener("load", function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const Places = JSON.parse(xhr.responseText);
        const selectedID = localStorage.getItem('selected'); 
        console.log("Selected ID:", selectedID);

     
        const selectedPlace = Places.find(place => place.id == selectedID);

        if (selectedPlace) {
            output = placeTemplate(selectedPlace);
            addElement(output);
        } else {
            console.error("Place not found for ID:", selectedID);
        }
    }
});


xhr.open("GET", url, true);
xhr.send();

function placeTemplate(place) {
    return `
       <div class="place">
       <img class="place-photo" src="${place.image}" alt="${place.name}">
       <h2 class="place-name">${place.name}</h2>
       <p class="place-location">Address: ${place.location}</p>
       <p class="place-description">${place.description}</p>
       </div>`;
}

function addElement(dataInput) {
    const displayDiv = document.getElementById("display") || createDisplayDiv();

    displayDiv.innerHTML = `
    <h1 class="title">More Details</h1>
    <a href="index.html" class="btn2">&#8592; Back</a>
    ${dataInput}`;
}

function createDisplayDiv() {
    const newDiv = document.createElement("div");
    newDiv.id = "display";
    document.body.appendChild(newDiv); 
    return newDiv;
}
