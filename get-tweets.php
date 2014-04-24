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
$consumerkey = "YNbYtwtl1zkwndMSEMh30A";
$consumersecret = "JCOdqDrmYQ2rATR2ry4NYGxEG16ZY6kFUxeruIkv6w";
$accesstoken = "298116056-Ggoi7CT3KXW3IucqcVbBX7crMp4nlq1leVnib4BM";
$accesstokensecret = "l7bc0cSu0TMetxF4Ly9fmVJmGLIHYkjmNdF5GbfkRcDTi";

// Create a connection
$conn = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

// Get the latest tweets
$tweets = $conn->get("https://api.twitter.com/1.1/search/tweets.json?geocode=" . $position . "," . $radius . "mi" . "&count=200");

// Response
 echo json_encode($tweets);

?>