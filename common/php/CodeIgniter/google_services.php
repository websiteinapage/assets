<?php
$base_url=dirname(__DIR__);
include_once $base_url . DS . "third_party" . DS . "vendor" . DS . "google" . DS . "google-api-php-client" . DS . "src" . DS . "Google_Client.php";
include_once $base_url . DS . "third_party" . DS . "vendor" . DS . "google" . DS . "google-api-php-client" . DS . "src" . DS . "contrib" . DS . "Google_Oauth2Service.php";
include_once $base_url . DS . "third_party" . DS . "vendor" . DS . "google" . DS . "google-api-php-client" . DS . "src" . DS . "contrib" . DS . "Google_YouTubeService.php";

class Google_services {
    
    private $CI;
    public $oauth;
    public $google;
    public $service;
    public $youtube;
    public $userinfo;
    public $ready = false;
    const OAUTH_TOKEN_INDEX = "goa_tokens";
    const OAUTH_USER_INDEX = "goa_user";
    
    function __construct() {
        $this->CI =& get_instance();
    }
    /*
     * OTHER SCOPES
    'https://www.googleapis.com/auth/drive', 
    'https://www.googleapis.com/auth/drive.file'
     */
    
    public function connect($config, $scopes = array(
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/youtube'
    ), $api_mode=false) {
        $this->google = new Google_Client();
        $this->config = $config;
        $this->google->setClientId($config['client_id']);
        $this->google->setClientSecret($config['client_secret']);
        $this->google->setRedirectUri($config['redirect_url']);
        $this->google->setScopes($scopes);
        $this->google->setUseObjects(false);
        
        if(!empty($_REQUEST['code'])):
            $this->authenticate($_REQUEST['code']);
        else:    
            $this->oauth = new Google_Oauth2Service($this->google);
            $this->youtube = new Google_YouTubeService($this->google);
            if($this->getTokens()):
                $this->google->setAccessToken($this->getTokens());
                return $this->verify_credentials($this->getTokens(), $api_mode);
            else:
                if($api_mode):
                    return false;
                else:
                    redirect($this->getAuthUrl());
                endif;
            endif;
        endif;
    }
    
    private function authenticate($code) {
        $this->oauth = new Google_Oauth2Service($this->google);
        $this->youtube = new Google_YouTubeService($this->google);
        $token = $this->google->authenticate($code);
        $this->google->setAccessToken($token);
        $this->userinfo = $this->oauth->userinfo->get();
        if(!empty($this->userinfo)):
            $this->setUser($this->userinfo['id'], $token);
            $this->ready = true;
            return $this->userinfo;
        endif;
    }
    
    public function verify_credentials($credentials, $api_mode=false) {
        $this->google->setAccessToken($credentials);
        $userinfo = $this->oauth->userinfo->get();
        $token = json_decode($this->getTokens(), TRUE);
        // refresh token before re-attempt
        $this->google->refreshToken($token['refresh_token']);
        if(!empty($userinfo)):
            $this->ready = true;
            return $userinfo;
        else:
            if($api_mode):
                return false;
            else:
                // re-authenticate
                redirect($this->getAuthUrl());
            endif;
        endif;
    }
    
    public function isReady() {
        return $this->ready;
    }
    
    function getAuthUrl() {
        try {
            $authUrl = $this->google->createAuthUrl();
            return $authUrl;
            //return array('success'=>true, 'authUrl'=>$authUrl);
        } catch (Exception $ex) {
            return false;
            // return array('success'=>false, 'message'=>$ex->getMessage());
        }
    }
    
    private function setUser($id, $token) {
        $this->CI->session->set_userdata(APP_NAME . ":" . self::OAUTH_USER_INDEX . ".id", $id);
        $this->CI->session->set_userdata(APP_NAME . ":" . self::OAUTH_TOKEN_INDEX, $token);
    }
    
    function getUser() {
        $user = $this->CI->session->userdata(APP_NAME . ":" . self::OAUTH_USER_INDEX);
        if (!empty($user)) {
          return $user;
        }
    }
    
    private function getUserId() {
        $user = $this->getUser();
        if(!empty($user)):
            return $user['id'];
        endif;
    }
    
    public function cleanUser() {
        $this->CI->session->unset_userdata(APP_NAME . ":" . self::OAUTH_USER_INDEX);
        $this->CI->session->unset_userdata(APP_NAME . ":" . self::OAUTH_TOKEN_INDEX);
    }
    
    public function getTokens() {
        $token = $this->CI->session->userdata(APP_NAME . ":" . self::OAUTH_TOKEN_INDEX);
        return $token;
    }
    
    public function videos($userid="~",$action="~") {
        $output= array();
        switch($action):
            case "search":
                /*
                $res = $this->youtube->search;
                $q = empty($_REQUEST['q'])?"":$_REQUEST['q'];
                $output = $res->listSearch('snippet', 
                        array(
                            'q'=>filter_var($q, FILTER_SANITIZE_STRING),
                            'videoEmbeddable'=>true,
                            'maxResults'=>75
                            )
                        );
                 */
                return null;
                break;
            
            default:
                $res = $this->youtube->playlists;
                $output = $res->listPlaylists('id,snippet,status');
                return $output;
        endswitch;
    }
    
}
