// Global array to hold markers so they can be cleared as an overlay
var markersArray = [];

// On document ready
$(document).ready( function () {

	// Use default location: Halifax
	position = {
		lat: 44.6558461,
		lng: -63.5835512
	};


	// Setup default map
	load_map(position);

});

function load_map(position) {

	// Map options
	var mapOptions = {

		// Center of map
	    center: new google.maps.LatLng(position.lat, position.lng),

	    // Zoom level (1-20)
	    zoom: 15,

	    // One of three types of maps: ROADMAP, TERRAIN, SATELLITE
	    mapTypeId: google.maps.MapTypeId.ROADMAP,

	    styles: [{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#dddddd"},{"saturation":-100},{"lightness":-3},{"visibility":"on"}]}]
	};

	// Map reference (global)
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	infoWindow = new google.maps.InfoWindow({ width: 1300, disableAutoPan: true });

	// When the bounds change, get tweets for current bounds
	google.maps.event.addListener(map, 'idle', function() {

		// var bounds =	map.getBounds().getSouthWest().lat() + "," +
		// 				map.getBounds().getSouthWest().lng() + "," +
		// 				map.getBounds().getNorthEast().lng() + "," +
		// 				map.getBounds().getNorthEast().lng();

		// Get radius of viewable region (in miles)
		bounds = map.getBounds();

		center = bounds.getCenter();
		ne = bounds.getNorthEast();

		// r = radius of the earth in statute miles
		var r = 3963.0;  

		// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
		var lat1 = center.lat() / 57.2958; 
		var lon1 = center.lng() / 57.2958;
		var lat2 = ne.lat() / 57.2958;
		var lon2 = ne.lng() / 57.2958;

		// distance = circle radius from center to Northeast corner of bounds
		var radius = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
		Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

		// console.log(radius);

		clear_overlays();

		var position = map.getCenter();

		position = position.lat() + "," + position.lng();

		get_tweets(position, radius);
	});


	// Setup search autocomplete
	var input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// // Filter by cities
	// var acOptions = {
	// 	types: ['(cities)']
	// }

	var autocomplete = new google.maps.places.Autocomplete(input);
	
	// When a place is selected from the autocomplete
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
    
	    var place = autocomplete.getPlace();
	    if (!place.geometry) {
	      return;
	    }

	    // If the place has a geometry, use it
	    if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
	    } else {
			map.setCenter(place.geometry.location);
			map.setZoom(19);
	    }
	});
}

function add_marker(geocode, tweet){

	// console.log(geocode);

	// Marker Options
	var markerOptions = {
	    position: new google.maps.LatLng(geocode.lat, geocode.lng),
    	animation: google.maps.Animation.BOUNCE
	};

	// Marker reference 
	var marker = new google.maps.Marker(markerOptions);

	// Push marker to array so it can be cleared
	markersArray.push(marker);

	// Set marker
	marker.setMap(map);
	marker.setIcon('http://i.imgur.com/sDzG0hR.png');

	// // Setup marker info window
	// infoWindowOptions = {
	//    	content: tweet
	// };

	// Tweet with profile image 
	// var tweetHtml = "<img src='" + tweet.user.profile_image_url + "'><h1 class='username'>@" + tweet.user.screen_name + "</h1><p>" + tweet.text + "</p>";
	

	// Tweet without profile image 
	var tweetHtml = "<h1 class='username'><a href='http://twitter.com/" + tweet.user.screen_name + "' target='_new'>@" + tweet.user.screen_name + "</a></h1><p>" + tweet.text + "</p>";

	google.maps.event.addListener(marker, 'click', function() {
		marker.setAnimation(null);
		marker.setIcon("http://i.imgur.com/faNkQRd.png");
		infoWindow.setContent(tweetHtml);
		infoWindow.open(map, this);
	});

}


function initiate_geolocation() {
            navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}
 
function handle_geolocation_query(position){

    position = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	};

	load_map(position);
}

function clear_markers(){
	google.maps.Map.prototype.clearMarkers = function() {
	for(var i=0; i < map.markers.length; i++){
		map.markers[i].setMap(null);
	}
		map.markers = new Array();
	};
}

function clear_overlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
		markersArray[i].setMap(null);
	}
		markersArray.length = 0;
}

function get_tweets(position, radius) {

	// console.log("position:" + position);
	// console.log("radius:" + radius);

	$.ajax({
            url: 'get-tweets.php',
            data: {
            	position: position,
            	radius: radius
            },
            beforeSend: function () {
  				$("#loader").html('<img src="http://www.wordcurl.com/twitter-loader-128.gif" />').fadeIn();
			},

            success: function(response) {

            	var counter = 0;

            	$('#loader').fadeOut();

                var results = $.parseJSON(response);

                // console.log(results);

                $.each(results.statuses, function(index, tweet) {


                    try {

                        var geocode = {
                            lat: tweet.coordinates.coordinates[1],
                            lng: tweet.coordinates.coordinates[0]
                        };

                        // console.log(tweet.text);

                        setTimeout( function() {
                        	add_marker(geocode, tweet);
                        	}, index * 25);


                        counter += 1;

                    } catch (e) {

                    }

                });

                toastr.info("Showing "  + counter + ' tweets found in this area.');
            }
        });
}