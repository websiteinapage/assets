<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GlobalClient
 *
 * @author uchilaka
 */
class GlobalClient {
    //put your code here
    public $params;
    public $CLIENT_ID;
    public $CLIENT_SECRET;
    public $SERVER;
    public $REDIRECT_URL;
    public $EMAIL;
    public $SCOPE;
    
    public function __construct( $params ) {
        //$this->params = array('server', 'redirect_url', 'client_id', 'client_secret');
        $this->params = array('server', 'redirect_url');
        
        foreach($this->params as $param):
            if(empty($params[$param])):
                $missing_params[] = $param;
            endif;
        endforeach;
        
        if(!empty($missing_params)):
            throw new Exception("Missing parameters: " . json_encode($missing_params));
        endif;
        
        //$this->CLIENT_ID = $params['client_id'];
        //$this->CLIENT_SECRET = $params['client_secret'];
        $this->SERVER = $params['server'];
        $this->REDIRECT_URL = $params['redirect_url'];
        if(!empty($params['email'])):
            $this->EMAIL = $params['email'];
        endif;
        if(!empty($params['scope'])):
            $this->SCOPE = $params['scope'];
        endif;
    }
    
}
