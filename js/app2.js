//Model
var model = {
	currentPlace: null,
	myPlaces: [
		{position: {lat: 35.883324, lng: -84.523895},
			map: map,
			title: "Mama Mia's Restaurant-Pizzeria",
			description: "Mama Mia's: Thin crust pizza and 70s decor",
			locationID: 17269784,
			type: 'Restaurant'
		},
		{position: {lat: 35.8833019, lng: -84.52331630000003},
			map: map,
			title: "Smokehouse Bar n Grill",
			description: 'Smokehouse Bar n Grill: The closest thing to a ' +  
				'sports bar Kingston is likely to get.',
			locationID: 17792245,
			type: 'Restaurant'
		},
		{position: {lat: 35.882102, lng: -84.505977},
			map: map,
			title: "Don Eduardo's Mexican Grill",
			description: "Don Eduardo's: A bit salty. Water, please?",
			locationID: 17270326,
			type: 'Restaurant'
		},
		{position: {lat: 35.875116, lng: -84.52033013105392},
			map: map,
			title: "Roane County High School",
			description: "Roane County High School: Lord of the Flies 2",
			locationID: '',
			type: 'School'
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: "Handee Burger",
			description: "Handee Burger: Greasy, but no spoons",
			locationID: 17269781,
			type: 'Restaurant'
		},
		{position: {lat: 35.861100, lng: -84.527949},
			map: map,
			title: "Fort Southwest Point",
			description: "Fort Southwest Point: An early American fort",
			locationID: 'fort-southwest-point-kingston',
			type: 'Park'
		}
	],
	myOutsideSources: [
		{vendor: 'Zomato',
			key: 'xxx',
			startUrl: 'https://developers.zomato.com/api/v2.1/restaurant?res_id='
		},
		{vendor: 'Yelp',
			key: {},
			startUrl: 'https://api.yelp.com/v2/business/'
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
	},
	
	getAllSources: function() {
		return model.myOutsideSources;
	},
	hello: function() {
		console.log('Hello');
	}
};

//View
//var map = new initMap();
//var infowindow = new initInfoWindow();

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.874415, lng: -84.515031},
		zoom: 15,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		scaleControl: true,
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}
	});	
};	

function initInfoWindow() {
	infowindow = new google.maps.InfoWindow({
			content: description,
			maxWidth: 275
		})
};

function ViewModel() {
	var self = this;
	var allPlaces = control.getAllPlaces();
	self.places = ko.observableArray([]);
	for (var i = 0; i < allPlaces.length; i++) {
		self.places.push(allPlaces[i]);
	};
	
	this.toggle=function() {
		var e = document.getElementById('menu');
		if (e.style.display == 'block') {
			e.style.display = 'none';
			} else {
				e.style.display = 'block';
			}
	};

};
ko.applyBindings(new ViewModel());

/**

	var place, i, infowindow, marker, description;
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
				
				console.log(x.position.lat, x.position.lng);
				map.panTo({lat: (x.position.lat), lng: (x.position.lng)});
				//map.panTo(LatLng(x.position.lat, x.position.lng) );
				infowindow.open(map, marker); 
				toggleBounce(x, marker);
				if (x.type == 'Restaurant') {
					getZomato(x);
				} else {
					infowindow.setContent(x.description);
				}
			} 
		}
	};	
	
	function getZomato(x) {
		var allSources = control.getAllSources();
		var currentSource = [];
		for (var i = 0; i < allSources.length; i++) {
			if (allSources[i].vendor == 'Zomato') {
				currentSource.push(allSources[i]);
			}
		}
		var url = currentSource[0].startUrl + x.locationID + '&apikey=' + currentSource[0].key;
		console.log(currentSource);
			
		$.getJSON( url, function( business ) {
			businessStr = 
			'<div class="infowindow"><h3>' + business.name + '</h3>' +
			'<p>' + business.location.address + '<br>' +
			'<strong>Cuisine:</strong> ' + business.cuisines + '<br>' +
			'<strong>Average Cost for Two:</strong> $' + business.average_cost_for_two + '</br>' +
			'<strong>Average Zomato Rating:</strong> ' + business.user_rating.aggregate_rating +
				' (' + business.user_rating.rating_text + ')</p>' +
			'<p id="credits"><a href="' + business.url + '" target="new">Powered by Zomato</a></p><div>';
			if (business.thumb !== 'https://b.zmtcdn.com/images/res_avatar_120_1x_new.png') {
				businessStr = businessStr + '<div class=infowindow><p><img src="' + business.thumb +'"></p></div>';
			}
			infowindow.setContent(businessStr);
		});
		
	};

	//This solution for keeping the map centered on viewport resize comes from:
	//http://stackoverflow.com/questions/8792676/center-google-maps-v3-on-browser-resize-responsive
	//http://stackoverflow.com/users/127550/gregory-bolkenstijn
	function calculateCenter() {
		center = map.getCenter();
	}
	google.maps.event.addDomListener(map, 'idle', function() {
		calculateCenter();
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
	});

	map.fitBounds(
		{south:35.856494, west:-84.532931, north:35.885037, east:-84.507149}
	);



*/

/**
		var node = document.createElement('li');
		var t = document.createTextNode(place.title);
		node.appendChild(t);
		document.getElementById('menu').appendChild(node);
		
		node.addEventListener('click', (function(placeCopy) {
			return function() {
				control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place)); */
