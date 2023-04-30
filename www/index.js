
// Initialize and add the map
function initMap() {
  // The location of Uluru
  const myHome = { lat: 37.2445, lng: 127.0746 };
  // The map, centered at Uluru
  window.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: myHome,
    gestureHandling: 'greedy'
  });


  //Pan to current Location 상단 버튼 코드 시작

  const options = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: Infinity
  };
  window.infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          window.infoWindow.setPosition(pos);
          window.infoWindow.setContent("Location found.");
          window.infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, window.infoWindow, map.getCenter());
        }, options
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, window.infoWindow, map.getCenter());
    }
  });
  ////Pan to current Location 상단 버튼 코드 끝

  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: myHome,
    map: map,
  });

  var socket = io();
  google.maps.event.addListener(map, "click", function (e) {
    socket.emit("location", e.latLng);
  });
}

////Pan to current Location 상단 버튼 코드 2 시작
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
////Pan to current Location 상단 버튼 코드 2 끝

window.initMap = initMap;