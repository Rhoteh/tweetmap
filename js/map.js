// Global array to hold markers so they can be cleared as an overlay
var markersArray = [];

// On document ready
$(document).ready( function () {

	// Use default location: New York City
	position = {
		lat: 44.6492671,
		lng: -63.6229474
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
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Map reference (global)
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

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

		console.log(radius);

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
			map.setZoom(15);
	    }
	});
}

function add_marker(geocode, tweet){

	console.log(geocode);

	// Marker Options
	var markerOptions = {
	    position: new google.maps.LatLng(geocode.lat, geocode.lng),
    	animation: google.maps.Animation.DROP
	};

	// Marker reference 
	var marker = new google.maps.Marker(markerOptions);

	// Push marker to array so it can be cleared
	markersArray.push(marker);

	// Set marker
	marker.setMap(map);

	// Setup marker info window
	infoWindowOptions = {
	   	content: tweet
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker,'click',function(e){	  
		infoWindow.open(map, marker);	  
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
            success: function(response) {

                var results = $.parseJSON(response);

                console.log(results);

                $.each(results.statuses, function(index, tweet) {

                    try {

                        var geocode = {
                            lat: tweet.coordinates.coordinates[1],
                            lng: tweet.coordinates.coordinates[0]
                        };

                        // console.log(tweet.text);
                        add_marker(geocode, tweet.text);

                    } catch (e) {

                    }

                });


            }
        });
}