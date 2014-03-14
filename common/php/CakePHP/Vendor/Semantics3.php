<?php
define("ASSET_ABS_DIR", str_replace('CakePHP/Vendor', '', dirname(__FILE__)));

include_once ASSET_ABS_DIR . "/oauth-php/library/OAuthStore.php";
include_once ASSET_ABS_DIR . "/oauth-php/library/OAuthRequester.php";

//include_once dirname(__FILE__) . "/oauth-php/library/OAuthStore.php";
//include_once dirname(__FILE__) . "/oauth-php/library/OAuthRequester.php";

if (!function_exists('curl_init')) {
  throw new Exception('Semantics3 needs the CURL PHP extension.');
}
if (!function_exists('json_decode')) {
  throw new Exception('Semantics3 needs the JSON PHP extension.');
}
if (!class_exists('OAuthRequester')) {
  throw new Exception('Semantics3 needs the OAUTH-PHP extension.');
}
/*
require(dirname(__FILE__) . '/Semantics3/Error.php');
require(dirname(__FILE__) . '/Semantics3/AuthenticationError.php');
require(dirname(__FILE__) . '/Semantics3/ParameterError.php');


require(dirname(__FILE__) . '/Semantics3/ApiConnector.php');
require(dirname(__FILE__) . '/Semantics3/Products.php');
*/
require (ASSET_ABS_DIR . '/Semantics3/Error.php');
require (ASSET_ABS_DIR . '/Semantics3/AuthenticationError.php');
require (ASSET_ABS_DIR . '/Semantics3/ParameterError.php');
require (ASSET_ABS_DIR . '/Semantics3/ApiConnector.php');
require (ASSET_ABS_DIR . '/Semantics3/Products.php');
