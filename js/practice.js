//Practice.js
var locationID = 17270326;
var zomatoApiKey = 'eae8f9e214a0616278ac70ef1df3dfce';
var url = 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' +
	locationID + '&apikey=' + zomatoApiKey;

function getZomato() {
	$.getJSON( url, function( business ) {
		document.getElementById('someplace').innerHTML = 
		'<h3>' + business.name + '</h3>' +
			'<p>' + business.location.address + '</p>' +
			'<p>Cuisine: ' + business.cuisines + '</p>' +
			'<p>Average Cost for Two: $' + business.average_cost_for_two + '</p>' +
			'<p>Average Zomato Rating: ' + business.user_rating.aggregate_rating +
				' (' + business.user_rating.rating_text + ')</p>' +
			'<p><img src="' + business.thumb +'"></p>';
	});
};
getZomato();

//eae8f9e214a0616278ac70ef1df3dfce

/*



*/