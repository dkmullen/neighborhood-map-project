//Model
var model = {
	currentPlace: null,
	myPlaces: [
		{position: {lat: 35.883324, lng: -84.523895},
			map: map,
			title: "Mama Mia's Restaurant-Pizzeria",
			description: "Mama Mia's: Thin crust pizza and 70s decor"
		},
		{position: {lat: 35.8833019, lng: -84.52331630000003},
			map: map,
			title: "Smokehouse Bar n Grill",
			description: "Smokehouse Bar n Grill: The closest thing to a sports bar Kingston is likely to get."
		},
		{position: {lat: 35.8776972, lng: -84.5229296},
			map: map,
			title: "RedBones on the River",
			description: "Redbones: Out of potatos again? Really?"
		},
		{position: {lat: 35.875116, lng: -84.52033013105392},
			map: map,
			title: "Roane County High School",
			description: "Roane County High School: Lord of the Flies 2"
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: "Handee Burger",
			description: "Handee Burger: Greasy, but no spoons"
		},
		{position: {lat: 35.876639, lng: -84.521292},
			map: map,
			title: "Kingston Community Center",
			description: "Kingston Community Center: The center of our community"
		}
	]
};

//Control
var control = {
	
	getAllPlaces: function() {
		return model.myPlaces;
	},
	
	setCurrentPlace: function(place) {
		model.currentPlace = place;
	}
};


//View

var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.8796114, lng: -84.5159483},
		zoom: 16
	});	
	var place, i, infowindow, marker;
	var allPlaces = control.getAllPlaces();
	var markers = [];
	
	for (i = 0; i < allPlaces.length; i++) {
		place = allPlaces[i];
		
		marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: place.position,
			map: map,
			title: place.title	
		});
		markers.push(marker);
		
		marker.addListener('click', (function(placeCopy) {
			return function() {
				control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place));
		
		var node = document.createElement('li');
		var t = document.createTextNode(place.title);
		node.appendChild(t);
		document.getElementById('menu').appendChild(node);
	}
	
	function showInfoWindow(x, marker) {
		infowindow = new google.maps.InfoWindow({
			content: x.description
		});
		infowindow.open(map, marker);
	};
	
	function match(x) {
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title == x.title) {
				marker = markers[i];
				showInfoWindow(x, marker);
			} 
		}
	};	
};

