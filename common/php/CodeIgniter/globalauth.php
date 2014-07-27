<?php

/*
 * The MIT License
 *
 * Copyright 2014 uchilaka.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Description of globalauth
 *
 * @author uchilaka
 */
$abspath = dirname(dirname(dirname(dirname(__DIR__)))) . '/';
define('SVRPATH', $abspath);
if(!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}
require_once __DIR__ . DS . 'globalclient.php';
require_once SVRPATH . 'assets' . DS . 'common' . DS . 'php' . DS . 'oauth-api'. DS . 'http.php';
require_once SVRPATH . 'assets' . DS . 'common'. DS . 'php'. DS . 'oauth-api' . DS . 'oauth_client.php';
define("VENDOR_BASE", SVRPATH . 'assets' . DS .'common'.DS.'php'.DS);

class Globalauth {
    
    var $client = null;
    
    // Endpoints
    public $linkedin = array(
        'oauth'=>'https://www.linkedin.com/uas/oauth2/',
        'api'=>'https://api.linkedin.com/v1/'
    );
    public $twitter = array(
        'oauth'=>'https://api.twitter.com/oauth/',
        'api'=>'https://api.twitter.com/1.1/'
    );
    public $google = array(
        'oauth'=>'https://accounts.google.com/o/oauth2/',
        'api'=>'https://www.googleapis.com/oauth2/v1/',
        'scope'=>'email profile',
        'fields'=>'id,email,given_name,family_name,name'
    );
    
    public $yahoo = array(
        'oauth'=>'https://api.login.yahoo.com/oauth/v2/',
        'api'=>'http://social.yahooapis.com/v1/',
        'host'=>'social.yahooapis.com',
        'realm'=>'yahooapis.com'
    );
    
    public function __construct() {
        $this->CI =& get_instance();
        $this->CI->load->model('application_model', 'webapp');
        $this->CI->load->library('curl');
        $this->app = $this->CI->webapp->initialize();
        //print_r($this->app);
    }

    public function setup( $params ) {
        $this->client = new Globalclient($params);
    }
    
    public function challenge($hijack=false, $redirect=null) {
        if(empty($this->client)) {
            throw new Exception("client setup is required");
        }
        $error = null;
        switch($this->client->SERVER) {
            case "Facebook":
                require_once VENDOR_BASE . 'facebook' . DS . 'php-sdk' . DS . 'src' . DS . 'facebook.php';
                $fb = new Facebook(array(
                    'appId'=>$this->app['fb_api_key'],
                    'secret'=>$this->app['fb_api_secret']
                ));
                try {
                    $fb_user = $fb->api('/me','GET'); 
                    
                } catch (Exception $ex) {

                }
                break;
        }
    }
    
}
