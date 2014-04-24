// Global array to hold markers so they can be cleared as an overlay
var markersArray = [];

$(document).ready( function () {

	// Use default location: Halifax
	position = {
		lat: 44.6558461,
		lng: -63.5835512
	};

	// Setup default map
	load_map(position);

	// Get end-user geolocation
	$( '#btn_mylocation' ).on( 'click', function() {
		initiate_geolocation();
	});
	
	// TODO: Keyword search
	$( '#btn_keyword' ).on( 'click', function() {
		console.log( 'keyword button clicked');
		return false;
	});
});

function load_map(position) {

	var mapOptions = {

		// Location
	    center: new google.maps.LatLng(position.lat, position.lng),

	    // Zoom level (0 to 20 with 0 being the entire world )
	    zoom: 15,

	    // One of three types of maps: ROADMAP, TERRAIN, SATELLITE
	    mapTypeId: google.maps.MapTypeId.ROADMAP,

	    // Style array by snazzymaps.com
	    styles: [{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#dddddd"},{"saturation":-100},{"lightness":-3},{"visibility":"on"}]}]
	};

	// Map reference (global, no pun intended)
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// Create a new InfoWindow object that does not autopan the map when a marker is clicked
	infoWindow = new google.maps.InfoWindow({ width: 1300, disableAutoPan: true });

	// Get tweets for current bounds when the map becomes idle after panning or zooming (use this instead of 'bounds_changed')
	google.maps.event.addListener(map, 'idle', function() {

		// Clear previous markers (i.e tweets)
		clear_overlays();

		// Get the bounds of the viewable region (in miles)
		var bounds = map.getBounds();

		var center = bounds.getCenter();
		var ne = bounds.getNorthEast();

		// Radius of the earth in statute miles
		var r = 3963.0;  

		// Convert lat or lng from decimal degrees to radians by dividing by 57.2958
		var lat1 = center.lat() / 57.2958; 
		var lon1 = center.lng() / 57.2958;
		var lat2 = ne.lat() / 57.2958;
		var lon2 = ne.lng() / 57.2958;

		// Calculate the distance of the radius (center to Northeast corner of its bounds)
		var radius = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
		Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

		// Center of the map
		var position = map.getCenter();
		position = position.lat() + "," + position.lng();

		get_tweets(position, radius);
	});

	// Setup search autocomplete
	var input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
			console.log(map.setCenter(place.geometry.location));
			map.setZoom(19);
	    }
	});
}

function add_marker(geocode, tweet){

	// Tweet marker options
	var markerOptions = {
	    position: new google.maps.LatLng(geocode.lat, geocode.lng),
    	animation: google.maps.Animation.BOUNCE
	};

	// Marker reference 
	var marker = new google.maps.Marker(markerOptions);

	// Push marker to array so it can be cleared as a collection
	markersArray.push(marker);

	// Add marker to map
	marker.setMap(map);
	marker.setIcon('http://i.imgur.com/sDzG0hR.png');

	// Add tweet details to each marker
	var tweetHtml = "<h1 class='username'><a href='http://twitter.com/" + tweet.user.screen_name + "' target='_new'>@" + tweet.user.screen_name + "</a></h1><p>" + tweet.text + "</p>";

	// When a tweet is clicked: stop the bounce animation, replace with grayscale icon, close sibling markers, and open new marker 
	google.maps.event.addListener(marker, 'click', function() {
		marker.setAnimation(null);
		marker.setIcon("http://i.imgur.com/faNkQRd.png");
		infoWindow.setContent(tweetHtml);
		infoWindow.open(map, this);
	});
}

// Get the end-user's geolocation (new HTML5 feature)
function initiate_geolocation() {
    navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}
 
// Refresh the map using the end-user's users geolocation
function handle_geolocation_query(position){

    position = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	};
	load_map(position);
}

// Clear all tweet markers
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

// AJAX request to Twitter Search API 1.1
function get_tweets(position, radius) {

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

            	// When a bounds filter used, Twitter returns tweets with geocode data as well as locations within those bounds that are literal locations w/o geocode data
            	// Counts the number of tweets with usable geocode coordinates to used in notification
            	var counter = 0;

            	// Twitter loading GIF
            	$('#loader').fadeOut();

            	// Response object. For more information, see: https://dev.twitter.com/docs/platform-objects
                var results = $.parseJSON(response);

                // Loop through each tweet in the statuses array
                $.each(results.statuses, function(index, tweet) {
                    try {

                        var geocode = {
                            lat: tweet.coordinates.coordinates[1],
                            lng: tweet.coordinates.coordinates[0]
                        };

                        // Set a 0.025 second delay on adding markers to the map
                        setTimeout( function() {
                        	add_marker(geocode, tweet);
                        	}, index * 25);

                        counter += 1;

                    } catch (e) {
                    }

                });

                // Clear any previous notifications
                toastr.clear();

                // Position the notification toast to the bottom right of the window
                toastr.options = {
 					"positionClass": "toast-bottom-right"
 				};

                // Display the number of returned tweets with geocode data (i.e exclude literal locations)// 
                toastr.info("Showing "  + counter + ' tweets found in this area.');
            }
        });
}