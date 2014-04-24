<!-- 		Author:			Jonny MacEachern
			Date: 			31 March 2014 (Monday)
			Description:	Special Topics: Deliverable 3 and 4 ("Capstone")
  -->
 
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>tweetmap</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
 
	<!-- CSS -->
	<link rel="stylesheet" href="css/toastr.min.css">
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/bootstrap.theme.min.css">

	<!-- Google Web Font -->
	<link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
 
</head>
<body>

<div class="container-fluid navbar-default">
	<!-- Brand and toggle get grouped for better mobile display -->
	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
		<span class="sr-only">Toggle navigation</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		</button>
		<a class="navbar-brand" href=" <?php $_SERVER['REQUEST_URI'] ?>">tweetmap</a>
	</div>
	<!-- Collect the nav links, forms, and other content for toggling -->
	<div class="collapse navbar-collapse navbar-right" id="bs-example-navbar-collapse-1">
		<ul class="nav navbar-nav">
			<li><a id="btn_mylocation" href="#">My Location</a></li>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>
				<ul class="dropdown-menu">
					<li><a href="https://github.com/jonnymaceachern/tweetmap">View on GitHub</a></li>
					<li><a href="http://blog.jonny.me/using-the-twitter-api-1-1/">API Tutorial</a></li>
					<li class="divider"></li>
					<li><a href="http://jonny.me">Author</a></li>
				</ul>
			</li>
		</ul>
		<form class="navbar-form navbar-right" role="search">
			<div class="form-group">
				<input id="txt_keyword" type="text" class="form-control" placeholder="Search by keyword">
			</div>
			<button id="btn_keyword" keywordtype="submit" class="btn btn-default">Submit</button>
		</form>
	</div>
	<!-- /.navbar-collapse -->
</div>
<!-- /.container-fluid -->
</nav>


	<!-- Controls -->
	<input id="pac-input" class="controls" type="text" placeholder="Enter a location">

	<!-- Map container -->
	<div id="map"></div>

	<!-- AJAX Loader -->
	<div id="loader"></div>
 
	<!-- jQuery -->
	<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	<script src="js/toastr.min.js" type="text/javascript"></script>

	<!-- Bootstrap -->
	<script src="js/bootstrap.min.js" type="text/javascript"></script>
	
	<!-- Google Maps API --> 
	<!-- Note: the sensor value specifies whether or not you are using the users geolocation. This is required.-->
	<script src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>

	<!-- Map options -->
	<script type="text/javascript" src="js/map.js"></script>
 
</body>
</html>