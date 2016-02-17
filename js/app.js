/** The Data Model: Would normally be called from a server */
var Model = {
	currentPlace: null,
	myPlaces: [
		{position: {lat: 35.883324, lng: -84.524148},
			map: map,
			title: 'Mama Mia\'s Restaurant-Pizzeria',
			description: 'Mama Mia\'s: Thin crust pizza and 70s decor',
			locationID: 17269784,
			source: 'Zomato',
			type: 'Restaurant',			
			keys: 'pizza Italian Kingston all',
			icon: 'pizza.png'
		},
		{position: {lat: 35.885723, lng: -84.497461},
			map: map,
			title: 'Gloria Jean\'s Restaurant',
			description: 'Gloria Jean\'s: Southern cooking and hospitality',  
			locationID: 'gloria-jeans-kingston',
			source: 'Yelp',
			type: 'Restaurant',
			keys: 'burgers sandwiches southern pie Kingston all',
			icon: 'dinner.png'
		},
		{position: {lat: 35.882102, lng: -84.505977},
			map: map,
			title: 'Don Eduardo\'s Mexican Grill',
			description: 'Don Eduardo\'s: A bit salty. Water, please?',
			locationID: 17270326,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'bar tequila beer Kingston all',
			icon: 'dinner.png'
		},
		{position: {lat: 35.877760, lng: -84.511819},
			map: map,
			title: 'Mei Wei Chinese Restaurant',
			description: 'Mei Wei: Far East food in Near East Tennessee',
			locationID: '17269786',
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'Chinese Asian Kingston all',
			icon: 'dinner.png'
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: 'Handee Burger',
			description: 'Handee Burger: Greasy, but no spoons',
			locationID: 17269781,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'breakfast biscuits gravy sliders Kingston all',
			icon: 'hamburger.png'
		},
		{position: {lat: 35.861100, lng: -84.527949},
			map: map,
			title: 'Fort Southwest Point',
			description: 'Fort Southwest Point: An early American fort',
			locationID: 'fort-southwest-point-kingston',
			source: 'Yelp',
			type: 'Park',
			keys: 'museum history cannon Kingston all',
			icon: 'cannon.png'
		},
		{position: {lat: 35.870925, lng: -84.515573},
			map: map,
			title: 'Kingston Barber Shop',
			description: 'Kingston Barber Shop: A great place for your' +
			'Elvis-related looks',
			locationID: 'kingston-barber-shop-kingston-3',
			source: 'Yelp',
			type: 'Barber',
			keys: 'barber haircut trim Kingston all',
			icon: 'barber.png'
		}
	],
	myVendors: [
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

/** Control: Functions that communicate directly with the Model */
var Control = {
	setCurrentPlace: function(place) {
		Model.currentPlace = place;
	},
	getAllPlaces: function() {
		return Model.myPlaces;
	},
	getVendor: function(vendor){
		var vendorData = [];
		for (var i = 0; i < Model.myVendors.length; i++) {
			if (Model.myVendors[i].vendor == vendor) {
				vendorData.push(Model.myVendors[i]);
			}
		}
		return vendorData;
	}
};

/** Function for retrieving data from Zomato, formatting it for infowindow 
 *  The non-descriptive variable 'x' is used throughout to refer to one thing
 *  and only one: The item that the user just clicked on.
 *  @function
 */
function getZomato(x) {
	var businessStr;
	this.vendorData = Control.getVendor('Zomato');
	var url = this.vendorData[0].startUrl + x.locationID + '&apikey=' + 
		this.vendorData[0].key;
		
	$.getJSON( url, function( business ) {
		businessStr = 
			'<div class="infowindow"><h3>' + business.name + '</h3>' +
			'<p>' + business.location.address + '<br>' + 
			'<strong>Cuisine:</strong> ' + business.cuisines + '<br>' +
			'<strong>Average Cost for Two:</strong> $' + 
			business.average_cost_for_two + '</br>' +
			'<strong>Average Zomato Rating:</strong> ' + 
			business.user_rating.aggregate_rating + ' (' + 
			business.user_rating.rating_text + ')</p>' +
			'<p id="credits"><a href="' + business.url + 
			'" target="new">Powered by Zomato</a></p><div>';
		/**  If Zomato's 'business thumb' is their placeholder, ignore it. */
		if (business.thumb !== 
			'https://b.zmtcdn.com/images/res_avatar_120_1x_new.png') {
			businessStr = businessStr + '<div class=infowindow><p><img src="' + 
			business.thumb +'"></p></div>';
		}
	})
	.done(function() {
		infowindow.setContent(businessStr);
	})
	/** Fills infowidow with hard-coded description upon fail */
	.fail(function() {
		infowindow.setContent(x.description);
	});
}

/** Function for retrieving data from Yelp, formatting it for infowindow
 *  @function
 */
function getYelp(x) {
	var businessStr;
	this.vendorData = Control.getVendor('Yelp');

/** The makeid function (modified slightly by me) comes from csharptest.net
  * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random
		-characters-in-javascript/1349426#1349426
  * http://stackoverflow.com/users/164392/csharptest-net
  */	
	function makeid() {
		var text = "";
		var possible = "0123456789";
		for (var i = 0; i < 9; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

/** The method below for generating an oauth signature is from Marco Bettiolo
  * (with my data added) and requires his oauth-signature.js
  * https://github.com/bettiolo/oauth-signature-js
  */
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
		encodedSignature = oauthSignature.generate(httpMethod, yelpUrl, 
			parameters, consumerSecret, tokenSecret),
		// generates a BASE64 encode HMAC-SHA1 hash
		signature = oauthSignature.generate(httpMethod, yelpUrl, parameters, 
			consumerSecret, tokenSecret, { encodeSignature: false});
/** --------------End of Marco Bettiolo's code ---------------- */

	var newUrl = yelpUrl + '?oauth_consumer_key=' + 
		parameters.oauth_consumer_key + '&oauth_nonce=' + 
		parameters.oauth_nonce + '&oauth_signature_method=' + 
		parameters.oauth_signature_method + '&oauth_timestamp=' + 
		parameters.oauth_timestamp + '&oauth_token=' +
		parameters.oauth_token + '&oauth_version=' + 
		parameters.oauth_version + '&oauth_signature=' + encodedSignature;
	
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
			'<p id="credits"><a href="' + business.url + 
			'" target="new">Visit our Yelp Page</a></p><br>' +
			'<img src="' + business.image_url + '"><div>'; 
		}
	})	
	.done(function() {
		infowindow.setContent(businessStr);
	})
	/** Fills infowidow with hard-coded description upon fail */
	.fail(function() {
		infowindow.setContent(x.description);
	});
}

/** Init Google Map, etc. */
var map, infowindow, allPlaces;
var markers = ko.observableArray();

/** Structure supplied by Google's API. I moved the controls around a bit */
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.874415, lng: -84.515031},
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
	
/** This solution for keeping the map centered on viewport resize comes from:
  * http://stackoverflow.com/questions/8792676/center-google-maps-v3-on-
	browser-resize-responsive
  * http://stackoverflow.com/users/127550/gregory-bolkenstijn */
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
		{south:35.856494, west:-84.528388, north:35.886037, east:-84.507149}
	);
	
	allPlaces = Control.getAllPlaces();
	initMarkers(allPlaces);
	initInfoWindow();
}

function initInfoWindow() {
	infowindow = new google.maps.InfoWindow({
			maxWidth: 275
		});
}

function initMarkers(allPlaces) {
	for (var i = 0; i < allPlaces.length; i++) {
		this.place = allPlaces[i]; 
		var image = './pix/' + place.icon;
		marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: place.position,
			map: map,
			icon: image,
			title: place.title	
		});
		/** Records which marker is clicked, passes it to the two functions*/
		marker.addListener('click', (function(placeCopy) {
			return function() {
				Control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place));
		markers.push(marker);
	}
}

/** Function that links the clicked marker's title with the correct marker in
 *  the markers array to correctly position the infowindow. Also pans the map
 *  to center on that marker, then calls Zomato or Yelp
 *  @function
 */
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
}

/** Function from Google to make a clicked marker bounce */
function toggleBounce() {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
/** This setTimout solution is from Simon Steinberger
  * Makes the marker bounce once and then stop
  * http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
  * http://stackoverflow.com/users/996638/simon-steinberger */
		setTimeout(function(){ marker.setAnimation(null); }, 750);
	}
}

/** ViewModel */
function ViewModel() {
	var self = this;
	var bool = false;
	self.filterStr = ko.observable('');
	self.showMenu = ko.observable(bool);
	self.noMatches = ko.observable();
	
	var allPlaces = Control.getAllPlaces();
	for (var i = 0; i < allPlaces.length; i ++) {
		/** Adds the visible ko.observable to each place */
		allPlaces[i].visible = ko.observable(true);
	}
	self.places = ko.observableArray(allPlaces);
	
	/** Flips the boolean in the showMenu observable, toggling the menu on a
	 *  mobile device */
	this.toggle = function() {
		bool = !bool;
		return self.showMenu(bool);
	};
	
	/* Refreshes the menu to show all items after filter has removed some */
	this.showAll = function() {
		/** Turns off the no matches messagge */
		this.noMatches(false);
		/** Makes all the menu items visible, resets each marker */
		for (var i = 0; i < this.places().length; i++) {
			this.places()[i].visible(true);
			markers()[i].setMap(map);
		}
	};
	/** A function that takes an input string, searches each location's title,
	 *  description, type (ie restaurant, museum) and list of key words*
	 *  @function
	 */
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
			/** Looks for result (the lowercase version of user input in 
			 *  placeStr (the lowercase version of all the place data) */
			var n = placeStr.search(result);
			/** -1 indicates no match, so cooresponding menu items and markers
			 *  are hidden */
			if (n == -1) {
				this.places()[i].visible(false);
				markers()[i].setMap(null);
			}
			/** Counter keeps a running total of all the locations where
			 *  matches were found. This sum isn't important except if it
			 *  ends up as -1 each time through the loop */
			counter += n;
		}
		/** The next two lines reset the search form and empty the string
		 *  just to keep things tidy */
		document.getElementById('filter').reset();
		this.filterStr('');
		/** Determines if counter was -1 each time through the loop, which 
		 *  means no matches were found. Then it shows the whole menu and
		 *  makes visible the no matches message */
		if (counter == (-1 * this.places().length)) {
			this.showAll();
			this.noMatches(true);
		}
	};
}
ko.applyBindings(new ViewModel());
