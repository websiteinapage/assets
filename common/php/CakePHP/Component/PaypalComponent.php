<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PaypalComponent
 *
 * @author uchilaka
 */
App::uses('Component', 'Controller');

class PaypalComponent extends Component {
    //put your code here
    function initialize(Controller $controller) {
        parent::initialize($controller);
        /*define('PP_CONFIG_PATH', dirname(__FILE__) . "/paypal");
        if(file_exists( dirname(__FILE__). '/paypal/vendor/autoload.php')) {
            require dirname(__FILE__). '/paypal/vendor/autoload.php';
        } else {
            require dirname(__FILE__).'/paypal/PPAutoloader.php';
            PPAutoloader::register();
        }*/
        require_once(dirname(__FILE__)."/paypal/PPBootStrap.php");
    }

}

?>
