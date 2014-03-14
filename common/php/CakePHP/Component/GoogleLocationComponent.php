<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GoogleLocationComponent
 *
 * @author uchilaka
 */
App::uses('Component', 'Controller');
class GoogleLocationComponent extends Component {
    
    private $sensor = false;
    private $gep = "http://maps.googleapis.com/maps/api/geocode/json";
    private $mapkey;
    public $lastCallURL;
    // uses the curl component
    public $components = array('Curl', 'Place');
    
    //put your code here
    public function init( $sensor=false, $mapkey = null ) {
        $this->sensor = $sensor;
        $this->mapkey = $mapkey;
    }
    
    public function reverseLookup( $latitude, $longitude) {
        try {
            $latitude = doubleval($latitude);
            $longitude = doubleval($longitude);
        } catch(Exception $fe) {
            throw new Exception("Your latitude and longitude must be double values.");
        }
        $this->lastCallURL = $this->gep . "?latlng={$latitude},{$longitude}&sensor=" . ($this->sensor?"true":"false");
        $data = json_decode($this->Curl->get($this->lastCallURL), true);
        $data['latlng'] = "{$latitude},{$longitude}";
        return $data;
    }
    
    public function getAddress() {
        
    }
    
    public function getPostalCode() {
        
    }
    
}

?>
