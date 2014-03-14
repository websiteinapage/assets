<?php

App::import('Vendor', 'Semantics3');
App::uses('PhpReader', 'Configure');

class Semantics3Component extends Component {
    
    private $api_key;
    private $api_secret;
    
    public function initialize(Controller $controller) {
        // do initialize operations
        Configure::config('default', new PhpReader());
        $controller->loadModel('Openid');
        if($controller->Auth->loggedIn()):
            $openid = $controller->Openid->findByUserId($controller->Auth->user("id"));
            //print_r($openid);
            $this->api_key = $openid['Openid']['semantics3_key'];
            $this->api_secret = $openid['Openid']['semantics3_secret'];
        endif;
    }
    
    public function lookupProductByUpc($upc) {
        $requestor = new Semantics3_Products($this->api_key, $this->api_secret);
        $requestor->products_field("upc", $upc);
        return $requestor->get_products();
    }
    
}
