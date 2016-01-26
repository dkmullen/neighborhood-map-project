var map;
var myPlaces = [
	{position: {lat: 35.883324, lng: -84.523895},
		map: map,
		title: "Mama Mia's Restaurant-Pizzeria"
	},
	{position: {lat: 35.8833019, lng: -84.52331630000003},
		map: map,
		title: "Smokehouse Bar n Grill"
	},
	{position: {lat: 35.8776972, lng: -84.5229296},
		map: map,
		title: "RedBones on the River"
	},
	{position: {lat: 35.875116, lng: -84.52033013105392},
		map: map,
		title: "Roane County High School"
	},
	{position: {lat: 35.874415, lng: -84.515031},
		map: map,
		title: "Handee Burger"
	},
	{position: {lat: 35.876639, lng: -84.521292},
		map: map,
		title: "Kingston Community Center"
	}
];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.8796114, lng: -84.5159483},
		zoom: 16
	});	
	
	for (i = 0; i < myPlaces.length; i++) {
		var marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: myPlaces[i].position,
			map: map,
			title: myPlaces[i].title	
		});
		
		var node = document.createElement('li');
		var t = document.createTextNode(myPlaces[i].title);
		node.appendChild(t);
		document.getElementById('menu').appendChild(node);
	}
};


