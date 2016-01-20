var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.8807211, lng: -84.5095304},
    zoom: 15
  });
}