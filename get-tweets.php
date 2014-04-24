<?php 

// Include the TwitterAuth and OAuth library
require_once($_SERVER['DOCUMENT_ROOT'].'/twitteroauth/class/twitteroauth.php'); 
 
// Tweet filters
$position = "";
$position = $_GET['position'];
$radius = "";
$radius = $_GET['radius'];

// Reduce the radius to account for monitor aspect ratio
$radius /= 1.4;
 
// Authentication credentials via http://developer.twitter.com
$consumerkey = "redacted";
$consumersecret = "redacted";
$accesstoken = "redacted";
$accesstokensecret = "redacted";

// Create a connection
$conn = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

// Get the latest tweets
$tweets = $conn->get("https://api.twitter.com/1.1/search/tweets.json?geocode=" . $position . "," . $radius . "mi" . "&count=200");

// Response
 echo json_encode($tweets);

?>
