// Global: Array to hold markers so they can be cleared as an overlay
var markers_array = [];
var mc;
var tabCount = -1;

// Global: Google Maps styles object
var styles = {
	advocado_world: [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}],
	pale_dawn: [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}],
	blue_water: [{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
	gowalla: [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]}],
	subtle_grayscale: [{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#dddddd"},{"saturation":-100},{"lightness":-3},{"visibility":"on"}]}],
	flatmap: [{"stylers":[{"visibility":"off"}]},{"featureType":"road","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"road.arterial","stylers":[{"visibility":"on"},{"color":"#fee379"}]},{"featureType":"road.highway","stylers":[{"visibility":"on"},{"color":"#fee379"}]},{"featureType":"landscape","stylers":[{"visibility":"on"},{"color":"#f3f4f4"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#7fc8ed"}]},{},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#83cead"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"weight":0.9},{"visibility":"off"}]}]
}

// Global: Use flatmap as the default style
current_style = styles.subtle_grayscale;

$(document).ready( function () {

	$( '#map' ).css( 'height', $(window).height() - 50 );

	// Show instructions modal if cookie is undefined or false
	if( ($.cookie('modal_dismiss') == undefined) || ($.cookie('modal_dismiss') == "false") ){
		show_modal();
	}

	// Initiate browser geolocation button tooltip
	$('#btn_mylocation').tooltip();

	// Use default location: Halifax
	position = {
		lat: 44.6627716,
		lng: -63.6048082
	};
	
	// Setup default map
	load_map(position);

	// Get end-user geolocation
	$( '#btn_mylocation' ).on( 'click', function() {
		initiate_geolocation();
	});

	// Add checkmark icon to default default style in dropdown
	$( '#styles a[data-mapstyle=subtle_grayscale]' ).append( '<span id="selected-dropdown-item" class="glyphicon glyphicon-ok"></span>');

	// Delegate click listener for map styles dropdown
	$( '#styles' ).on( 'click', 'a[data-mapstyle]' , function() {
		var style_name = $(this).data( 'mapstyle' );
		current_style = styles[style_name];

		// Remove checkmark icon from previously selected style
		$( 'span#selected-dropdown-item' ).remove();

		// Append checkmark icon to show selected style
		$(this).append( '<span id="selected-dropdown-item" class="glyphicon glyphicon-ok"></span>');

		mapOptions.styles = current_style;
		mapOptions.zoom = map.getZoom();
		mapOptions.center = map.getCenter();
		map.setOptions(mapOptions);
	});

	// Add listener to instructions modal button
	$( '#show_modal' ).on( 'click', function () {
		show_modal();
	});

	// Tab to cycle through tweets
	document.addEventListener( 'keydown', function (e) {
		if (e.keyCode == '9') {

			// Prevent tab default
			e.preventDefault();

			if (e.shiftKey && markers_array.length > 0 && tabCount > 0) {
				tabCount --;
				google.maps.event.trigger( markers_array[tabCount], 'click' );
			} else if (markers_array.length > 0 && tabCount < (markers_array.length - 1) && e.shiftKey === false) {
					tabCount++;
					google.maps.event.trigger( markers_array[tabCount], 'click' );
			}
		}
	});
	
	// TODO: Keyword search
	$( '#btn_keyword' ).on( 'click', function() {
		console.log( 'keyword button clicked');
		return false;
	});
});

function load_map(position) {

	mapOptions = {

		// Location
		center: new google.maps.LatLng(position.lat, position.lng),

	    // Zoom level (0 to 20 with 0 being the entire world)
	    zoom: 15,

	    // One of three types of maps: ROADMAP, TERRAIN, SATELLITE
	    mapTypeId: google.maps.MapTypeId.ROADMAP,

	    // Select a style from the style array
	    styles: current_style
	};

	// Map reference (global, no pun intended)
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// Create a new InfoWindow object that does not autopan the map when a marker is clicked
	infoWindow = new google.maps.InfoWindow({
		maxWidth: 500,
		disableAutoPan: true,
		boxStyle: {
			width: "500px"
		}
	});

	// Get tweets for current bounds when the map becomes idle after panning or zooming (use this instead of 'bounds_changed')
	google.maps.event.addListener(map, 'idle', function() {

		// Clear previous markers (i.e tweets)
		clear_markers();

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

		console.log( "Radius: " + radius + " mi" );
		console.log( "Zoom: " + map.getZoom() );

		// Center of the map
		var position = map.getCenter();
		position = position.lat() + "," + position.lng();

		get_tweets(position, radius);
	});

	// Setup search autocomplete
	input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	autocomplete = new google.maps.places.Autocomplete(input);
	
	// When a place is selected from the autocomplete
	google.maps.event.addListener(autocomplete, 'place_changed', function() {

		place = autocomplete.getPlace();
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
		optimized: false
    	// animation: google.maps.Animation.BOUNCE
    };

	// Marker reference 
	var marker = new google.maps.Marker(markerOptions);

	// Add marker to map
	marker.setIcon('img/tweet3.png');

	// Add tweet details to each marker
	var tweetHtml = "<div class='card'><div class='user'><a href='https://twitter.com/" +
	tweet.user.screen_name + "' target='_new'><img src='" + tweet.user.profile_image_url + "'></div><div class='tweet'><a href='https://twitter.com/" + tweet.user.screen_name + "'  class='username' target='_new'>@" + 
	tweet.user.name + "</a>" + tweet.text + "</div></div>";

	// When a tweet is clicked: stop the bounce animation, replace with grayscale icon, close sibling markers, and open new marker 
	google.maps.event.addListener(marker, 'click', function() {
		marker.setAnimation(null);
		marker.setIcon("img/tweet3-grayscale.png");
		infoWindow.setContent(tweetHtml);
		infoWindow.open(map, this);

		var iw_container = $(".gm-style-iw").parent();
		iw_container.stop().hide();
		iw_container.fadeIn(400);

		google.maps.event.removeListener(mouseoverHandle);
	});

	var mouseoverHandle = google.maps.event.addListener(marker, 'mouseout', function() {
		infoWindow.close();	
	});

	google.maps.event.addListener(marker, 'mouseover', function() {
		infoWindow.setContent(tweetHtml);
		infoWindow.open( map, this);

		var iw_container = $(".gm-style-iw").parent();
		iw_container.stop().hide();
		iw_container.fadeIn(400);
	});

	google.maps.event.addListener( map, 'click', function() {
		infoWindow.close();	
	});

	// Push marker to array so it can be cleared as a collection
	markers_array.push(marker);
}

// Get the end-user's geolocation (new HTML5 feature)
function initiate_geolocation() {
	navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}

// Refresh the map using the end-user's users geolocation
function handle_geolocation_query(position){

	var center = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
	map.setCenter(center);

}

// Clear all markers
function clear_markers() {
	for (var i = 0; i < markers_array.length; i++ ) {
		markers_array[i].setMap(null);
	}
	
	markers_array.length = 0;

	if ('undefined' !== typeof mc) {
		mc.clearMarkers();
	}
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
			$("#loader").stop().html('<img src="img/loader.gif" /><span>Fetching data...</span>').fadeIn(1000);
		},

		success: function(response) {

            	// When a bounds filter used, Twitter returns tweets with geocode data as well as locations within those bounds that are literal locations w/o geocode data
            	// Counts the number of tweets with usable geocode coordinates to used in notification
            	var counter = 0;

            	// Twitter loading GIF
            	$('#loader').fadeOut(1000);

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
                        // setTimeout( function() {
                        	add_marker(geocode, tweet);
                        	// }, index * 25);

            	counter += 1;

            } catch (e) {
            }
        });

            	tabCount = -1;

            	var mcOptions = {
            		gridSize: 50,
            		maxZoom: 18,
            		styles: [{
            			textSize: 12,
            			textColor: "#FFFFFF",
            			height: 53,
            			url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            			width: 53
            		}]
            	};

            	mc = new MarkerClusterer(map, markers_array, mcOptions);

                // Position the notification toast to the bottom right of the window
                toastr.options = {
                	"positionClass": "toast-bottom-right"
                };

                // Display the number of returned tweets with geocode data (i.e exclude literal locations)// 
                toastr.info("Showing "  + counter + ' tweets found in this area.');
            }
        });
}

function show_modal () {

	$('#instructionsModal').modal();

	$('#instructionsModal').on('hide.bs.modal', function(e) {
		var status = $("input[name=dismiss]", this).is(":checked");
		$.cookie('modal_dismiss', status, {
			expires: 7,
			path: '/'
		});
	});
}