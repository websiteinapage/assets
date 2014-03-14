<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SocialsharingHelper
 *
 * @author uchilaka
 */
App::uses('Component', 'Controller');
class SocialsharingComponent extends Component {
    
    private $FB_SHARE = "https://www.facebook.com/dialog/feed?app_id=#APP_ID#&link=#LINK#&picture=#IMG_LINK#&redirect_uri=#CALLBACK_URL#&name=#NAME#&caption=#CAPTION#&description=#DESC#";
    private $TWITTER_SHARE = "https://twitter.com/share?url=#LINK#&via=#TWITTER_USER#&text=#TXT#";

    public function initialize(\Controller $controller) {
        parent::initialize($controller);
        if(defined('FB_SHARE')) {
            $this->FB_SHARE = FB_SHARE;
        }
        if(defined('TWITTER_SHARE')) {
            $this->TWITTER_SHARE = TWITTER_SHARE;
        }
    }
    
    public function getFbShareLink($sharelink, $name, $description, $imagelink, $caption="", $callback="", $app_id=null) {
        if(empty($callback)): $callback=APP_BASE; endif;
        $fblink = str_replace("#LINK#", urldecode($sharelink),$this->FB_SHARE);
        if(!empty($app_id)):
            str_replace('#APP_ID#', $app_id, $fblink);
        endif;
        $fblink = str_replace("#IMG_LINK#", urldecode($imagelink), $fblink);
        $fblink = str_replace("#NAME#", urldecode($name), $fblink);
        $fblink = str_replace("#CAPTION#", urldecode($caption), $fblink); 
        $fblink = str_replace("#CALLBACK_URL#", urldecode($callback), $fblink);
        $fblink = str_replace("#DESC#",urldecode($description),$fblink);
        return $fblink;
    }
    
    public function cleanString($var) {
        return preg_replace('/\#/', '', $var);
    }
    
    public function shareOnTwitter_Link($text, $url=null, $via=null, $hashtags=null) {
        $twlink = str_replace("#LINK#", urldecode($url), $this->TWITTER_SHARE);
        $twlink = str_replace("#TWITTER_USER#", $via, $twlink);
        $twlink = str_replace("#TXT#", urldecode($text), $twlink);
        return $twlink;
    }
    
    //put your code here
    public function shareOnFb_Link($app_id, $sharelink, $name, $description, $imagelink, $caption="", $callback="") {
        if(empty($callback)): $callback=APP_BASE; endif;
        $fblink = str_replace("#LINK#", urldecode($sharelink),$this->FB_SHARE);
        $fblink = str_replace('#APP_ID#', $app_id, $fblink);
        $fblink = str_replace("#IMG_LINK#", urldecode($imagelink), $fblink);
        $fblink = str_replace("#NAME#", urldecode($this->cleanString($name)), $fblink);
        $fblink = str_replace("#CAPTION#", urldecode($this->cleanString($caption)), $fblink); 
        $fblink = str_replace("#CALLBACK_URL#", urldecode($callback), $fblink);
        $fblink = str_replace("#DESC#",urldecode($this->cleanString($description)),$fblink);
        return $fblink;
    }
    
    public function getFbPostLink($app, $link, $name, $description, $imagelink, $template, $caption="", $callback="") {
        /** @throws Exception **/
        if(empty($callback)):
            throw new Exception("<callback> is required.");
        endif;
        $fblink = str_replace("#LINK#", urldecode($link), $template);
        $fblink = str_replace('#APP_ID#', $app, $fblink);
        $fblink = str_replace("#IMG_LINK#", urldecode($imagelink), $fblink);
        $fblink = str_replace("#NAME#", urldecode($name), $fblink);
        $fblink = str_replace("#CAPTION#", urldecode($caption), $fblink); 
        $fblink = str_replace("#CALLBACK_URL#", urldecode($callback), $fblink);
        $fblink = str_replace("#DESC#",urldecode($description),$fblink);
        return $fblink;
    }
}

