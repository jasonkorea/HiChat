


//https://github.com/googlemaps/js-api-loader/issues/715
import { Loader } from "@googlemaps/js-api-loader";

const apiOptions = {
    apiKey: "AIzaSyBMocf2kYIFt13hLMr3K9612hudC6P-Az0",
    version: "weekly",
}

const loader = new Loader(apiOptions);

loader.load().then(() => {
    console.log("Maps JS API loaded");
    const map = displayMap();
});

function displayMap() {
    const mapOptions = {
        center: {
            lat: 37.2445,
            lng: 127.0746
        },
        gestureHandling: 'greedy',
        zoom: 17
    }

    const mapDiv = document.getElementById('map');
    const map = new google.maps.Map(mapDiv, mapOptions);
    return map;
}




const mapLoaderOptions = {
    apiKey: googleMapsAPIKey,
    divId: 'map',
    append: true, // Appends to divId. Set to false to init in divId.
    mapOptions: mapOptions,
    apiOptions: apiOptions,
};