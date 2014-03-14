<?php

define("GEO_DIR", ABS_ROOT . "assets" . DS . "common" . DS . "geolocation");
require_once  GEO_DIR . DS . "Net" . DS . "GeoIP.php";

App::uses('Component', 'Controller');

class IPLocationComponent extends Component {
    
    public function getLocation( $ip ) {
        $geoip = Net_GeoIP::getInstance(GEO_DIR . DS . "GeoLiteCity.dat", Net_GeoIP::STANDARD);
        if (!empty($ip)):
            $loc = $geoip->lookupLocation($ip);
        else:
            $loc = $geoip->lookupLocation($_SERVER['REMOTE_ADDR']);
        endif;
        $geoinfo = array(
            "countryName"=>$loc->countryName,
            "countryCode"=>$loc->countryCode,
            "longitude"=>$loc->longitude,
            "latitude"=>$loc->latitude,
            "postalCode"=>$loc->postalCode,
            "areaCode"=>$loc->areaCode,
            "region"=>$loc->region,
            "city"=>$loc->city
        );
        return $geoinfo;
    }
}
