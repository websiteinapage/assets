<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SlideshareComponent
 *
 * @author uchilaka
 */
//// Remote access to assets DIR
$DIR = str_replace(DS . 'CakePHP' . DS . 'Component', '', __DIR__) . DS;

//// Local access to assets DIR
// $DIR = ABS_ROOT . "assets" . DS . "common" . DS . "php" . DS;

require_once $DIR . 'Slideshare/PHPKit/SSUtil/SSUtil.php';

class SlideshareComponent extends Component {
    
    public $components = array('Gatekeeper');
    
    var $ctrlr;
    var $api;
    
    public function initialize(\Controller $controller) {
        $this->ctrlr = $controller;
        $this->api = new SSUtil();
        parent::initialize($controller);
    }
    
    public function getUser($username) {
        print_r($this->api->get_slideUser($username,0,50));
    }
    
    public function getApi() {
        return $this->api;
    }
    
    public function readUser() {
        // attempt to fetch slide user
        $meta = json_decode($this->ctrlr->__openid['Openid']['meta'], true);
        if(!empty($meta) && !empty($meta['slideshare_user'])):
            if(!empty($meta['slideshare_user']['password'])):
                $meta['slideshare_user']['password'] = $this->Gatekeeper->decode($meta['slideshare_user']['password']);
            endif;
            $this->ctrlr->set("slideUser", $meta['slideshare_user']);
            return $meta['slideshare_user'];
        endif;
    }
    
    public function writeUser() {
        $this->ctrlr->loadModel('Openid');
        $meta = json_decode($this->ctrlr->__openid['Openid']['meta'], true);
        $meta['slideshare_user'] = array(
            'username'=>$this->ctrlr->request->data['username'],
            'password'=>$this->Gatekeeper->encode($this->ctrlr->request->data['password'])
        );
        $this->ctrlr->Openid->set("id", $this->ctrlr->__openid['Openid']['id']);
        $this->ctrlr->Openid->saveField('meta', json_encode($meta));
        // re-pull Openid
        $this->ctrlr->__openid = $this->ctrlr->Openid->findById($this->ctrlr->__openid['Openid']['id']);
    }
    
}
