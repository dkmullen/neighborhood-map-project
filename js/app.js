var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.8796114, lng: -84.5159483},
    zoom: 16
  });
  
  var marker1 = new google.maps.Marker({
    position: {lat: 35.883324, lng: -84.523895},
    map: map,
    title: "Mama Mia's Restaurant-Pizzeria"
  });
  var marker2 = new google.maps.Marker({
    position: {lat: 35.8833019, lng: -84.52331630000003},
    map: map,
    title: "Smokehouse Bar n Grill"
  });
  var marker3 = new google.maps.Marker({
    position: {lat: 35.8776972, lng: -84.5229296},
    map: map,
    title: "RedBones on the River"
  });
  var marker4 = new google.maps.Marker({
    position: {lat: 35.875116 , lng: -84.52033013105392},
    map: map,
    title: "Roane County High School"
  });
  var marker5 = new google.maps.Marker({
    position: {lat: 35.874415  , lng: -84.515031},
    map: map,
    title: "Handee Burger"
  });
}