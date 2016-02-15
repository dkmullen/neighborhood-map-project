//Model
var model = {
	currentPlace: null,
	myPlaces: [
		{position: {lat: 35.883324, lng: -84.523895},
			map: map,
			title: "Mama Mia's Restaurant-Pizzeria",
			description: "Mama Mia's: Thin crust pizza and 70s decor",
			locationID: 17269784,
			source: 'Zomato',
			type: 'Restaurant',			
			keys: 'pizza Italian Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.8833019, lng: -84.52331630000003},
			map: map,
			title: "Smokehouse Bar n Grill",
			description: 'Smokehouse Bar n Grill: The closest thing to a ' +  
				'sports bar Kingston is likely to get.',
			locationID: 17792245,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'ribs beer barbecue burger fries music karaoke Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.882102, lng: -84.505977},
			map: map,
			title: "Don Eduardo's Mexican Grill",
			description: "Don Eduardo's: A bit salty. Water, please?",
			locationID: 17270326,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'bar tequila beer Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.877760, lng: -84.511819},
			map: map,
			title: "Mei Wei Chinese Restaurant",
			description: "Mei Wei: Far East food in Near East Tennessee",
			locationID: '17269786',
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'Chinese Asian Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: "Handee Burger",
			description: "Handee Burger: Greasy, but no spoons",
			locationID: 17269781,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'breakfast biscuits gravy sliders Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.861100, lng: -84.527949},
			map: map,
			title: "Fort Southwest Point",
			description: "Fort Southwest Point: An early American fort",
			locationID: 'fort-southwest-point-kingston',
			source: 'Yelp',
			type: 'Park',
			keys: 'museum history cannon Kingston all',
			visible: ko.observable(true)
		},
		{position: {lat: 35.870925, lng: -84.515573},
			map: map,
			title: "Kingston Barber Shop",
			description: "Kingston Barber Shop: A great place for your Elvis-related looks",
			locationID: 'kingston-barber-shop-kingston-3',
			source: 'Yelp',
			type: 'Barber',
			keys: 'barber haircut trim Kingston all',
			visible: ko.observable(true)
		}
	],
	myOutsideSources: [
		{vendor: 'Zomato',
			key: '',
			startUrl: 'https://developers.zomato.com/api/v2.1/restaurant?res_id='
		},
		{vendor: 'Yelp',
			key: {
				oauth_consumer_key : '',
				oauth_token : '',
				consumerSecret: '',
				tokenSecret: ''
			},
			startUrl: 'https://api.yelp.com/v2/business/'
		}
	]
};

//Control
var control = {
	setCurrentPlace: function(place) {
		model.currentPlace = place;
	},
	getVendor: function(vendor){
		var vendorData = [];
		for (var i = 0; i < model.myOutsideSources.length; i++) {
			if (model.myOutsideSources[i].vendor == vendor) {
				vendorData.push(model.myOutsideSources[i]);
			}
		}
		return vendorData;
	}
};
//Section for dealing with Zomato
function getZomato(x) {
	var businessStr;
	this.vendorData = control.getVendor('Zomato')
	var url = this.vendorData[0].startUrl + x.locationID + '&apikey=' + this.vendorData[0].key;
		
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
		
	})
	.done(function() {
		infowindow.setContent(businessStr);
	})
	.fail(function() {
			infowindow.setContent(x.description);
	})
};

//Section for dealing with Yelp
function makeid() {
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < 9; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

function getYelp(x) {
	var businessStr;
	this.vendorData = control.getVendor('Yelp')
	var httpMethod = 'GET',
		yelpUrl = vendorData[0].startUrl + x.locationID,
		parameters = {
			oauth_consumer_key : this.vendorData[0].key.oauth_consumer_key,
			oauth_token : this.vendorData[0].key.oauth_token,
			oauth_nonce : makeid(),
			oauth_timestamp : Math.round((new Date()).getTime() / 1000.0),
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0',
			callback: 'cb'
		},
		consumerSecret = vendorData[0].key.consumerSecret,
		tokenSecret = vendorData[0].key.tokenSecret,
		// generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
		encodedSignature = oauthSignature.generate(httpMethod, yelpUrl, parameters, consumerSecret, tokenSecret),
		// generates a BASE64 encode HMAC-SHA1 hash
		signature = oauthSignature.generate(httpMethod, yelpUrl, parameters, consumerSecret, tokenSecret,
			{ encodeSignature: false});

	var newUrl = yelpUrl + '?oauth_consumer_key=' + 
		parameters.oauth_consumer_key + '&oauth_nonce=' + parameters.oauth_nonce +
		'&oauth_signature_method=' + parameters.oauth_signature_method + 
		'&oauth_timestamp=' + parameters.oauth_timestamp + '&oauth_token=' 
		+ parameters.oauth_token + '&oauth_version=' + parameters.oauth_version +
		'&oauth_signature=' + encodedSignature;
	
	$.ajax({
		type: "GET",
		url: newUrl,
		cache: true,
		jsonpCallback: 'cb',
		dataType: "jsonp",
		success: function ( business ) {
			businessStr = 
			'<div class="infowindow"><h3>' + business.name + '</h3>' +
			'<p>' + business.location.display_address + '<br>' +
			'Phone: ' + business.display_phone + '<br>' +
			'<img src="' + business.rating_img_url +'"><br>' +
			'<strong>Rating:</strong> ' + business.rating + '</p>' +
			'<p id="credits"><a href="' + business.url + '" target="new">Visit our Yelp Page</a></p><br>' +
			'<img src="' + business.image_url + '"><div>'; 
		}
	})	
	.done(function() {
		infowindow.setContent(businessStr);
	})
	.fail(function() {
		infowindow.setContent(x.description);
	})
};	

//Init Google Map, etc.
var map, infowindow, currentPlaces;
var markers = ko.observableArray();

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.874415, lng: -84.515031},
		//zoom: 15,
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
	
	//This solution for keeping the map centered on viewport resize comes from:
	//http://stackoverflow.com/questions/8792676/center-google-maps-v3-on-browser-resize-responsive
	//http://stackoverflow.com/users/127550/gregory-bolkenstijn
	var center;
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
	
	currentPlaces = model.myPlaces;
	initMarkers(currentPlaces), initInfoWindow();
};	

function initInfoWindow() {
	infowindow = new google.maps.InfoWindow({
			maxWidth: 275
		})
};

function initMarkers(currentPlaces) {
	for (var i = 0; i < currentPlaces.length; i++) {
		this.place = currentPlaces[i]; 		
		marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: place.position,
			map: map,
			title: place.title	
		});
		marker.addListener('click', (function(placeCopy) {
			return function() {
				control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place));
		markers.push(marker);
	};
};

function match(x) {
	for (var i = 0; i < markers().length; i++) {
		if (markers()[i].title == x.title) {
			marker = markers()[i];
			map.panTo({lat: (x.position.lat), lng: (x.position.lng)});
			infowindow.open(map, marker); 
			toggleBounce(x, marker);
			if (x.source == 'Zomato') {
				getZomato(x);
			} 
			else if (x.source == 'Yelp') {
				getYelp(x);
			}
		} 
	}
};	

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

//ViewModel
function ViewModel() {
	var self = this;
	var bool = false;
	self.places = ko.observableArray(model.myPlaces);
	self.filterStr = ko.observable('');
	self.showMenu = ko.observable(bool);
	self.noMatches = ko.observable();
	
	this.toggle = function() {
		bool = !bool;
		return self.showMenu(bool);
	};
	
	this.showAll = function() {
		this.noMatches(false);
		for (var i = 0; i < this.places().length; i++) {
			this.places()[i].visible(true);
			markers()[i].setMap(map);
		}
	};

	this.filter = function(filterStr) {
		this.noMatches(false);
		var counter = 0;
		var result = this.filterStr().toLowerCase();
		for (var i = 0; i < this.places().length; i++) {
			this.places()[i].visible(true);
			markers()[i].setMap(map);
			var placeStr = this.places()[i].description.toLowerCase() + ' ' +
				this.places()[i].title.toLowerCase() +  ' ' +
				this.places()[i].type.toLowerCase() +
				this.places()[i].keys.toLowerCase();
			var n = placeStr.search(result);
			if (n == -1) {
				this.places()[i].visible(false);
				markers()[i].setMap(null);
			}
			counter += n;
		}
		document.getElementById('filter').reset();
		this.filterStr('');
		if (counter == (-1 * this.places().length)) {
			this.showAll();
			this.noMatches(true);
		}
	};
}; 
ko.applyBindings(new ViewModel());
