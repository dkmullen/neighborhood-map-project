//Practice.js

function loadData() {

    var $wikiElem = $('#wikipedia-links');
	var title = 'Fort Southwest Point';

    // clear out old data before new request
    $wikiElem.text("");
	
	//load wiki list
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + title + '&format=json&callback=wikiCallback';
	
	//error handling workaround
	var wikiRequestTimeout = setTimeout(function(){
         $wikiElem.text("Wikipedia articles could not be loaded.");
    }, 8000);
	
	$.ajax({
		type: "GET",
		url: wikiURL,
		dataType: "jsonp",
		success: function ( response ) {
			//response[0] is the search term itself; [1] is the list of results
			//[2] is a description snippet, [3] is the url to the wiki page!
			var placeName = response[1];
			var placeDescrip = response[2];
			var placeWikiLink = response[3];
			console.log(wikiURL);
            $wikiElem.append("<h2><a href='" + placeWikiLink + 
				"'target='_blank'>" + placeName + "</a></h2>" +
				"<p>" + placeDescrip + "</p");

			//tell err message not to load if success
			clearTimeout(wikiRequestTimeout);
		}
	});

    return false;
};

$('#form-container').submit(loadData);

loadData();

//https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=jsonfm&titles=Fort%20Southwest%20Point

