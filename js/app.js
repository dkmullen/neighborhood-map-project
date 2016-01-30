//Model
var model = {
	currentPlace: null,
	myPlaces: [
		{position: {lat: 35.883324, lng: -84.523895},
			map: map,
			title: "Mama Mia's Restaurant-Pizzeria",
			description: "Mama Mia's: Thin crust pizza and 70s decor",
			locationID: 17269784
		},
		{position: {lat: 35.8833019, lng: -84.52331630000003},
			map: map,
			title: "Smokehouse Bar n Grill",
			description: "Smokehouse Bar n Grill: The closest thing to a sports bar Kingston is likely to get.",
			locationID: 17792245
		},
		{position: {lat: 35.882102, lng: -84.505977},
			map: map,
			title: "Don Eduardo's Mexican Grill",
			description: "Don Eduardo's: A bit salty. Water, please?",
			locationID: 17270326
		},
		{position: {lat: 35.875116, lng: -84.52033013105392},
			map: map,
			title: "Roane County High School",
			description: "Roane County High School: Lord of the Flies 2",
			locationID: ''
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: "Handee Burger",
			description: "Handee Burger: Greasy, but no spoons",
			locationID: 17269781
		},
		{position: {lat: 35.876639, lng: -84.521292},
			map: map,
			title: "Kingston Community Center",
			description: "Kingston Community Center: The center of our community",
			locationID: ''
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
		center: {lat: 35.8806844, lng: -84.5150555},
		zoom: 16
	});	
	var place, i, infowindow, marker, description;
	var allPlaces = control.getAllPlaces();
	var markers = [];
	
	infowindow = new google.maps.InfoWindow({
			content: description,
			maxWidth: 200
		});
	
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
		
		node.addEventListener('click', (function(placeCopy) {
			return function() {
				control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place));
	}

	function toggleBounce() {
	  if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	  } else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		
		//Found this setTimout solution on StackOverflow by Simon Steinberger
		//http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
		//http://stackoverflow.com/users/996638/simon-steinberger
		//Makes the marker bounce once and then stop
		setTimeout(function(){ marker.setAnimation(null); }, 750);
	  }
	};
	
	function match(x) {
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title == x.title) {
				marker = markers[i];
				
				infowindow.open(map, marker); 
				toggleBounce(x, marker);
				getZomato(x);
			} 
		}
	};	
	
	function getZomato(x) {
		var zomatoApiKey = 'xxx';
		var url = 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' +
			x.locationID + '&apikey=' + zomatoApiKey;
			
		$.getJSON( url, function( business ) {
			businessStr = 
			'<h3>' + business.name + '</h3>' +
			'<p>' + business.location.address + '</p>' +
			'<p>Cuisine: ' + business.cuisines + '</p>' +
			'<p>Average Cost for Two: $' + business.average_cost_for_two + '</p>' +
			'<p>Average Zomato Rating: ' + business.user_rating.aggregate_rating +
				' (' + business.user_rating.rating_text + ')</p>' +
			'<p><img src="' + business.thumb +'"></p>';
			infowindow.setContent(businessStr);
		});
		
	};
};
// 

