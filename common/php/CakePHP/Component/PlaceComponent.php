<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Location
 *
 * @author uchilaka
 */
class PlaceComponent extends Component {
    //put your code here
    public $places = array();
    
    public function parseGooglePlaces( $gr ) {
        // gr = google result
        if(!empty($gr['results'])):
            foreach($gr['results'] as $p):
                $place;
                if(!empty($p['formatted_address'])):
                    $place['address'] = $p['formatted_address'];
                endif;
                // get other stuff
                if(!empty($p['address_components'])):
                    foreach($p['address_components'] as $bits):
                        if(in_array("street_number", $bits["types"])):
                            $place['street_number'] = $bits["long_name"];
                        elseif (in_array("route", $bits["types"])):
                            $place['street_route'] = $bits["long_name"];
                        elseif(in_array("locality", $bits["types"]) && in_array("political", $bits["types"])):
                            $place['locality'] = $bits["long_name"];
                        elseif(in_array("administrative_area_level_1", $bits["types"]) && in_array("political", $bits["types"])):
                            $place['region'] = $bits["long_name"];
                        elseif(in_array("country", $bits["types"]) && in_array("political", $bits["types"])):
                            $place['country'] = $bits["long_name"];
                            $place['alpha2'] = $bits["short_name"];
                        elseif(in_array("postal_code", $bits["types"])):
                            $place['postal_code'] = $bits["long_name"];
                        endif;
                    endforeach;
                    $place["geometry"] = $p["geometry"];
                endif;
                if(!empty($place)): 
                    $place["latlng"] = $gr['latlng'];
                    $this->places[] = $place;
                endif;
            endforeach;
        endif;
        return $this->places;
    }
}

?>
