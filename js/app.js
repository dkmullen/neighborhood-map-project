/** The Data Model: Would normally be called from a server
 *  The app can be adopted to any location by changing only Model data
 */
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
			keys: 'pizza Italian Mama-Mia\'s',
			icon: 'pizza.png'
		},
		{position: {lat: 35.885723, lng: -84.497461},
			map: map,
			title: 'Gloria Jean\'s Restaurant',
			description: 'Gloria Jean\'s: Southern cooking and hospitality',  
			locationID: 'gloria-jeans-kingston',
			source: 'Yelp',
			type: 'Restaurant',
			keys: 'burgers sandwiches southern pie Gloria-Jean\'s',
			icon: 'dinner.png'
		},
		{position: {lat: 35.882102, lng: -84.505977},
			map: map,
			title: 'Don Eduardo\'s Mexican Grill',
			description: 'Don Eduardo\'s: A bit salty. Water, please?',
			locationID: 17270326,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'bar tequila beer Don-Eduardo\'s',
			icon: 'dinner.png'
		},
		{position: {lat: 35.877760, lng: -84.511819},
			map: map,
			title: 'Mei Wei Chinese Restaurant',
			description: 'Mei Wei: Far East food in Near East Tennessee',
			locationID: '17269786',
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'Chinese Asian Mei-Wei',
			icon: 'dinner.png'
		},
		{position: {lat: 35.874415, lng: -84.515031},
			map: map,
			title: 'Handee Burger',
			description: 'Handee Burger: Greasy, but no spoons',
			locationID: 17269781,
			source: 'Zomato',
			type: 'Restaurant',
			keys: 'breakfast biscuits-n-gravy sliders Handee-Burger',
			icon: 'hamburger.png'
		},
		{position: {lat: 35.861100, lng: -84.527949},
			map: map,
			title: 'Fort Southwest Point',
			description: 'Fort Southwest Point: An early American fort',
			locationID: 'fort-southwest-point-kingston',
			source: 'Yelp',
			type: 'Park',
			keys: 'museum history cannon Fort-Southwest-Point',
			icon: 'cannon.png'
		},
		{position: {lat: 35.870925, lng: -84.515573},
			map: map,
			title: 'Kingston Barber Shop',
			description: 'Kingston Barber Shop: A great place for your' +
			' Elvis-related looks',
			locationID: 'kingston-barber-shop-kingston-3',
			source: 'Yelp',
			type: 'Barber-Shop',
			keys: 'barber haircut trim Kingston-Barber-Shop',
			icon: 'barber.png'
		}
	],
	myVendors: [
		{vendor: 'Zomato',
			key: 'eae8f9e214a0616278ac70ef1df3dfce',
			startUrl: 'https://developers.zomato.com/api/v2.1/restaurant?res_id='
		},
		{vendor: 'Yelp',
			key: {
				oauth_consumer_key : 'QTiph1Uz4Cpuw2kOa2sG3Q',
				oauth_token : '0gjDnn-g5CvZg-DOpgs4EuwJ2reEbVtN',
				consumerSecret: 'YiK5tQt9n5ke2sSFQNof5GkJvHc',
				tokenSecret: 'Edt0OgvUQHgQfqsP4HWeYkZaUT4'
			},
			startUrl: 'https://api.yelp.com/v2/business/'
		}
	],
	/** Boundaries for the map*/
	myCoords: [
		{south:35.856494, west:-84.528388, north:35.886037, east:-84.507149}
	]
};
/** End Model ----------------------------------------- */

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
	},
	getMyCoords: function() {
		return Model.myCoords;
	}
};
/** End Control --------------------------------------- */

/** Function for retrieving data from Zomato, formatting it for infowindow 
 *  The non-descriptive variable 'x' is used throughout to refer to one thing
 *  and only one: The item that the user just clicked on.
 *  @function
 */
function getZomato(x) {
	var businessStr;
	var failStr = '<div class="infowindow">' + x.description +
			'.<p>(Zomato is not currently available).</p></div>';
	this.vendorData = Control.getVendor('Zomato');
	
	/** Creates the url Zomato requires for JSON request */
	var zomatoUrl = this.vendorData[0].startUrl + x.locationID + '&apikey=' + 
		this.vendorData[0].key;
	
	/** Makes the request, parses the data into a string */	
	$.getJSON( zomatoUrl, function( business ) {
		businessStr = 
			'<div class="infowindow"><h3>' + business.name + '</h3>' +
			'<p>' + business.location.address + '<br>' + 
			'<strong>Cuisine:</strong> ' + business.cuisines + '<br>' +
			'<strong>Average Cost for Two:</strong> $' + 
			business.average_cost_for_two + '</br>' +
			'<strong>Average Zomato Rating:</strong> ' + 
			business.user_rating.aggregate_rating + ' (' + 
			business.user_rating.rating_text + ')</p>' +
			'<p id="vendor-credits"><a href="' + business.url + 
			'" target="new">Powered by Zomato</a></p><div>';
			
		/**  If Zomato's 'business thumb' is their placeholder, don't use it. */
		if (business.thumb !== 
			'https://b.zmtcdn.com/images/res_avatar_120_1x_new.png') {
			businessStr = businessStr + '<div class=infowindow><p><img src="' + 
			business.thumb +'"></p></div>';
		}
	})
	/** Fills infowindow with the string made above */
	.done(function() {
		infowindow.setContent(businessStr);
	})
	/** Fills infowidow with hard-coded description upon fail */
	.fail(function() {
		infowindow.setContent(failStr);
	});
}
/** End Zomato ---------------------------------------- */

/** Function for retrieving data from Yelp, formatting it for infowindow
 *  @function
 */
function getYelp(x) {
	var businessStr;
	var failStr = '<div class="infowindow">' + x.description +
			'.<p>(Yelp is not currently available).</p></div>';
	this.vendorData = Control.getVendor('Yelp');

/** The makeid function (modified slightly by me) comes from csharptest.net
  * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random
		-characters-in-javascript/1349426#1349426
  * http://stackoverflow.com/users/164392/csharptest-net
  * Makes the oauth_nonce parameter of nine random integers
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
  * One important change: yelpUrl below is changed from Bettiolo's sample. See
  * this: https://github.com/bettiolo/oauth-signature-js/issues/18 
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
	
	/** Creates the url Yelp requires for an ajax request */
	var newYelpUrl = yelpUrl + '?oauth_consumer_key=' + 
		parameters.oauth_consumer_key + '&oauth_nonce=' + 
		parameters.oauth_nonce + '&oauth_signature_method=' + 
		parameters.oauth_signature_method + '&oauth_timestamp=' + 
		parameters.oauth_timestamp + '&oauth_token=' +
		parameters.oauth_token + '&oauth_version=' + 
		parameters.oauth_version + '&oauth_signature=' + encodedSignature;
	
	/** Makes the request, parses the data into a string */	
	$.ajax({
		type: "GET",
		url: newYelpUrl,
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
			'<p id="vendor-credits"><a href="' + business.url + 
			'" target="new">Visit our Yelp Page</a></p><br>' +
			'<img src="' + business.image_url + '"><div>'; 
		}
	})	
	/** Fills infowindow with the string made above */
	.done(function() {
		infowindow.setContent(businessStr);
	})
	/** Fills infowidow with hard-coded description upon fail */
	.fail(function() {
		infowindow.setContent(failStr);
	});
}
/** End Yelp ------------------------------------------ */

/** Init Google Map, etc. */
var map, infowindow, allPlaces;
var markers = ko.observableArray();
var mapFailMessage = ko.observable(false);

/** Structure supplied by Google's API. I moved the controls around a bit */
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
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
	/** The two listeners below read and recalculate the map center */
	google.maps.event.addDomListener(map, 'idle', function() {
		calculateCenter();
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
	});
	
	/** Rather than center on a point, we give the map boundaries */
	var coords = Control.getMyCoords();
	var bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(coords[0].south, coords[0].west),
		new google.maps.LatLng(coords[0].north, coords[0].east)
	);
	map.fitBounds(bounds);
	
	allPlaces = Control.getAllPlaces();
	initMarkers(allPlaces, coords, bounds);
	initInfoWindow();
}
/** When Google Maps fails, onerror in the htmm calls this function
 *  @function
 */
function googleError() {
	mapFailMessage(true);
}
	
function initInfoWindow() {
	infowindow = new google.maps.InfoWindow({
			maxWidth: 275
		});
}

/** Loops through the places in Model, makes a marker with the listed properties
 *  and a custom icon, adds a listener and pushes each to the observable array
 *  @function
 */
function initMarkers(allPlaces, coords, bounds) {

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
		
		/** Extends map boundaries to be sure to include each marker */
		bounds.extend(marker.position);
		
		/** Records which marker is clicked, passes it to the two functions*/
		marker.addListener('click', (function(placeCopy) {
			return function() {
				Control.setCurrentPlace(placeCopy);
				match(placeCopy);
			};
		})(place));
		markers.push(marker);
		
		/** Expands the map to include each new marker */
		map.fitBounds(bounds);
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
			/** Centers the clicked marker */
			map.panTo({lat: (x.position.lat), lng: (x.position.lng)});
			infowindow.open(map, marker); 
			/** Calles toggleBounce, below */
			toggleBounce(x, marker);
			if (x.source === 'Zomato') {
				getZomato(x);
			} 
			else if (x.source === 'Yelp') {
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
/** End Google Maps init section ---------------------- */


/** ViewModel */
function ViewModel() {
	var self = this;
	var bool, placeStr;
	var bool2 = false;
	self.filterStr = ko.observable('');
	self.showMenu = ko.observable(bool);
	self.showCredits = ko.observable(bool2);
	self.noMatches = ko.observable(0);
	
	var allPlaces = Control.getAllPlaces();
	for (var i = 0; i < allPlaces.length; i ++) {
		/** Adds the 'visible' ko.observable to each place */
		allPlaces[i].visible = ko.observable(true);
	}
	/** Makes an observable array out of the newly updated allPlaces */
	self.places = ko.observableArray(allPlaces);
	
	/** This media query event handler comes from Craig Buckler 
	 *  http://www.sitepoint.com/javascript-media-queries/
	 *  Listens for screen size change, flips the boolean to show or hid menu.
	 *  I found this difficult to do with a CSS media query due to the 
	 *  visible binding on the menu being over-ridden by a CSS property
	 */
	if (matchMedia) {
		/** Adds a media query, listens for width change of window */
	    var mq = window.matchMedia('(min-width: 600px)');
		    mq.addListener(WidthChange);
		    WidthChange(mq);
	}
	
	/** Shows/hides the menu according to width of window */
	function WidthChange(mq) {
	    if (mq.matches) {
			self.showMenu(true);
		} else {
			self.showMenu(false);
	  }
	}
	
	/** Flips the boolean in the showMenu observable, toggling the menu on a
	 *  mobile device when hamburger button is clicked 
	 */
	this.toggleMenu = function() {
		bool = !bool;
		return self.showMenu(bool);
	};
	
	/** Flips the boolean in the showCredits observable, toggling the menu on a
	 *  mobile device */
	this.toggleCredits = function() {
		bool = !bool;
		return self.showCredits(bool);
	};
	
	/* Refreshes the menu to show all items after filter has removed some */
	this.showAll = function() {
		/** Turns off the no matches message */
		this.noMatches(0);
		/** Makes all the menu items visible, resets each marker */
		for (var i = 0; i < this.places().length; i++) {
			this.places()[i].visible(true);
			markers()[i].setMap(map);
		}
	};
	
	/** A function that takes an input string, searches each location's title,
	 *  description, type (ie restaurant, museum) and list of key words and
	 *  updates the display of markers and menu items
	 *  @function
	 */
	this.filter = function(filterStr) {
		this.noMatches(0);
		var counter = 0;
		/** Converts user input to lowercase */
		var result = this.filterStr().toLowerCase();
		
		/** Loops through places array, resets all to visible, makes a string
		 *  (lower case) of each title, type and keywords; looks for matches
		 */
		for (var i = 0; i < this.places().length; i++) {
			this.places()[i].visible(true);
			markers()[i].setMap(map);
			
			/** Make sure all lines are space-separated to avoid bad matches */
			self.placeStr = this.places()[i].description.toLowerCase() + ' ' +
				this.places()[i].title.toLowerCase() + ' ' +
				this.places()[i].type.toLowerCase() + ' ' +
				this.places()[i].keys.toLowerCase();
			
			/** Looks for result (the lowercase version of user input in 
			 *  placeStr (the lowercase version of all the place data) */
			var n = self.placeStr.search(result);
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
			this.noMatches(1);
		}
	};	
	
	/** This section makes an auto complete feature for search and uses
	 *  EasyAutoComplete: http://easyautocomplete.com/
   	 */
	this.autoFillStr = '';
	/** Gets all the key words from places, adds them to the string, makes 
	 *  sure new lines have a space between
	 */
	for (i = 0; i < this.places().length; i++) {
		self.autoFillStr += this.places()[i].keys + ' ' +
			this.places()[i].type + ' ';
	}
	/** Splits the string on space, makes an array */
	var arr = self.autoFillStr.split(' ');
	
	/** Duplicate words in the array show up multiple times in the auto-complete
	 *  list, so this funtion eliminates them. Thanks to:
	 *  https://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
	 */
	function eliminateDuplicates(arr) {
		var i,
			len = arr.length,
			out = [],
			obj = {};

	  for (i = 0; i < len; i++) {
		/** The next line makes a key:value pair of item: 0. In JS objects,
		 *  keys are unique, so duplicaates get overwritten as the loop runs.
		 */
			obj[arr[i]] = 0;
	  }
	  /** Finally, we push the keys back to an array, with no duplicates! */
	  for (i in obj) {
			out.push(i);
	  }
	  return out;
	}
	
	var autoFillItems = eliminateDuplicates(arr);
	
	/** Sets data and theme for EasyAutoComplete; 'Match' makes sure that
	 *  non-matches disappear from the list as you type
	 */
	var options = {
		data: autoFillItems,
		list: {
			match: {
				enabled: true
			}
		},
		theme: "dark"
	};
	/** Calls a method from the autocomplete js on the search field in html */
	$("#search").easyAutocomplete(options);
	
	/** End auto-complete section ---------------------- */
}
ko.applyBindings(new ViewModel());

