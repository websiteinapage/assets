<?php
/*
 * The MIT License
 *
 * Copyright 2014 Uchenna Chilaka.
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
$abspath = dirname(dirname(dirname(dirname(__DIR__)))) . '/';
define('SVRPATH', $abspath);
if(!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}
require_once __DIR__ . DS . 'globalclient.php';
require_once SVRPATH . 'assets' . DS . 'common' . DS . 'php' . DS . 'oauth-api'. DS . 'http.php';
require_once SVRPATH . 'assets' . DS . 'common'. DS . 'php'. DS . 'oauth-api' . DS . 'oauth_client.php';

define("VENDOR_BASE", SVRPATH . 'assets' . DS .'common'.DS.'php'.DS);

class Globalauth2 {
    
    private $client;
    public $user;
    public $openid;
    public $app;
    private $CI;
    public $controller;
    public $userUpdateFields = array('first_name', 'last_name', 'verified_token');
    public $openIdUpdateFields = array('fb_id', 'fb_access_token', 'current_access_token', 'google_id', 'google_access_token', 'twitter_id', 'twitter_access_token');
    
    public $components = array('Curl');
    
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
        $this->CI->load->model('application_model', 'app');
        $this->CI->load->library('curl');
        $this->app = $this->CI->app->initialize();
    }
    
    public function setup( $params ) {
        $this->client = new Globalclient($params);
    }
    
    public function challenge($hijack=false, $redirect=null) {
        // handle challenge for all platforms
        if( empty($this->client) ):
            throw new Exception("Component setup is required.");
        endif;
        
        $error = null;
        
        switch($this->client->SERVER):
            case "Facebook":
                require_once VENDOR_BASE . 'facebook' . DS . 'php-sdk' . DS . 'src' . DS . 'facebook.php';
                
                $fb = new Facebook(array(
                    'appId'=>$this->app['fb_api_key'],
                    'secret'=>$this->app['fb_api_secret']
                ));
                try {
                    $this->user = $fb->api('/me','GET'); 
                    if(!empty($this->user)):
                        // get access token
                        $this->user['fb_access_token'] = $fb->getAccessToken();
                        $this->user['current_access_token'] = $this->user['fb_access_token'];
                        $this->user['verified_token'] = $this->user['fb_access_token'];
                        $this->user['fb_id'] = $this->user['id'];
                    endif;
                } catch (Exception $ex) {
                    $result = $ex->getResult();
                    if(!empty($_REQUEST['error'])):
                        $error = $_REQUEST['error'];
                    endif;
                    
                    if($error=="access_denied"):
                        // handle user denying access
                        throw new Exception($_REQUEST['error_description'], $_REQUEST['error_code']);
                    endif;
                    
                    // retreival failed of fb profile
                    $url = $fb->getLoginUrl(array(
                        'scope'=>empty($this->app['fb_scope'])?'email':$this->app['fb_scope'],
                        'redirect_uri'=>$this->client->REDIRECT_URL
                    ));
                    redirect($url, 'refresh');
                }
                break;
                
            case 'Linkedin':
                /** @TODO Store token in session **/
                if(!empty($_REQUEST['error'])):
                    // an error occured
                    throw new Exception('You login was unsuccessful.');
                endif;
                /*
                $credentials = $this->CI->session->userdata('linkedin_credentials');
                if(!empty($credentials)):
                    $this->linkedin['access_token'] = $credentials['access_token'];
                    // attempt to pull data
                    $profile_call = $this->linkedin['api'] . "people/~:(id,headline,date-of-birth,location:(country:(code)),picture-url,public-profile-url,first-name,last-name,email-address)?format=json&oauth2_access_token={$this->linkedin['access_token']}";
                    $resp = $this->CI->curl->exec($profile_call);
                    $profile_response = json_decode($resp, true);
                endif;
                 */
                
                if(empty($profile_response['id'])):
                    // no user data found
                    $this->CI->session->unset_userdata('linkedin_credentials');
                    // get profile info
                    try {
                        if(empty($_REQUEST['code'])):
                            // init Linkedin state
                            $this->CI->session->set_userdata("linkedin_state", random_string('alnum', 6));

                            $auth_call = $this->linkedin['oauth'] . "authorization?response_type=code"
                                . "&client_id={$this->app['linkedin_api_key']}"
                                . "&scope=r_basicprofile%20r_emailaddress" 
                                . "&state=" . $this->CI->session->userdata("linkedin_state")
                                . "&redirect_uri={$this->client->REDIRECT_URL}";
                            redirect($auth_call, "refresh");
                        else:
                            // code exists
                            $this->linkedin['state'] = $this->CI->session->userdata("linkedin_state");
                            $this->linkedin['code'] = $_REQUEST['code'];
                            // get access token
                            $token_call = $this->linkedin['oauth'] . "accessToken?grant_type=authorization_code"
                                . "&code=" . $_REQUEST['code']
                                . "&client_id={$this->app['linkedin_api_key']}"
                                . "&client_secret={$this->app['linkedin_api_secret']}"
                                . "&redirect_uri={$this->client->REDIRECT_URL}";
                            $resp = $this->CI->curl->exec($token_call);
                            $token_response = json_decode($resp, true);

                            if(empty($token_response['access_token'])):
                                throw new Exception("Your request timed out.");
                            endif;

                            // save to session
                            $this->CI->session->set_userdata('linkedin_token_response', $token_response);
                            $this->linkedin['access_token'] = $token_response['access_token'];
                        endif;

                        // get linkedin profile information
                        $profile_call = $this->linkedin['api'] . "people/~:(id,headline,date-of-birth,location:(country:(code)),picture-url,public-profile-url,first-name,last-name,email-address)?format=json&oauth2_access_token={$this->linkedin['access_token']}";
                        $resp = $this->CI->curl->exec($profile_call);
                        $profile_response = json_decode($resp, true);

                        if(empty($profile_response)):
                           throw new Exception("No user data returned."); 
                        endif;
                        /* 
                            Array ( 
                         * [emailAddress] => ndokoba@gmail.com 
                         * [firstName] => Uchenna 
                         * [headline] => Senior Programmer Analyst at Alliance Data 
                         * [id] => XPqiCcISer [lastName] => Chilaka 
                         * [location] => Array ( [country] => Array ( [code] => us ) ) 
                         * [pictureUrl] => http://m.c.lnkd.licdn.com/mpr/mprx/0_UiHHfFeu50JuJelHJCeUfkRyFpomUIrHJXpBf5Iy4sOYk7FecL4XTLxtdAEl42AXsho9hGJvQvPl 
                         * [publicProfileUrl] => http://www.linkedin.com/pub/uchenna-chilaka/15/735/584 )      
                         * 
                         */
                    } catch (Exception $ex) {
                        throw new Exception('Authentication failed.');
                    }
                    $this->user = $profile_response;
                    $this->user['linkedin_id']=$this->user['id'];
                    $this->user['linkedin_profile_url'] = $this->user['publicProfileUrl'];
                    $this->user['current_access_token'] = $this->linkedin['access_token'];
                    $this->user['linkedin_access_token'] = $this->user['current_access_token'];
                    $this->user['verified_token']=$this->user['current_access_token'];
                    $this->user['first_name'] = $this->user['firstName'];
                    $this->user['last_name'] = $this->user['lastName'];
                    $this->user['email'] = $this->user['emailAddress'];
                
                endif;
                
                break;
                
            case "Twitter":
                //// uses $GlobalClient->EMAIL for twitter platform - model for un-provided email address
                // App::import('Vendor', 'twitteroauth-master' . DS . 'twitteroauth' . DS . 'OAuth');
                // App::import('Vendor', 'twitteroauth-master' . DS . 'twitteroauth' . DS . 'twitteroauth');
                
                require_once VENDOR_BASE . 'twitteroauth-master' . DS . 'twitteroauth' . DS . 'OAuth.php';
                require_once VENDOR_BASE . 'twitteroauth-master' . DS . 'twitteroauth' . DS . 'twitteroauth.php';
                
                if(!empty($_REQUEST['denied'])):
                    throw new Exception('User denied access');
                endif;
                
                /*
                // attempt to retreive twitter credentials from session
                $this->twitter['credentials'] = $this->CI->session->userdata('twitter_credentials');
                */
                
                // check to make sure session has credentials
                if(!empty($this->twitter['credentials'])):
                    $twt = new TwitterOAuth($this->app['twitter_api_key'], $this->app['twitter_api_secret'], $this->twitter['credentials']['oauth_token'], $this->twitter['credentials']['oauth_token_secret']);
                    $info = $twt->get('account/verify_credentials');
                    // check if screen name is confirmed with credentials
                    if(empty($info->screen_name)):
                        // clear credentials
                        $this->CI->session->unset_userdata('twitter_credentials');
                        $info = null;
                    endif;
                endif;
                
                if(empty($info)):
                    $this->CI->session->unset_userdata('twitter_credentials');
                
                    if(empty($_REQUEST['oauth_token'])):
                        // no twitter token credentials available
                        $twt = new TwitterOAuth($this->app['twitter_api_key'], $this->app['twitter_api_secret']);
                        $temp_cred = $twt->getRequestToken($this->client->REDIRECT_URL);
                        // oauth_token, oauth_token_secret, oauth_callback_confirmed
                        $this->CI->session->set_userdata('twitter_temp_credentials', $temp_cred);
                        $token_call = $this->twitter['oauth'] . 'authenticate?oauth_token=' . $temp_cred['oauth_token'];
                        redirect($token_call);
                    endif;

                    // oauth_token is available
                    $twt = new TwitterOAuth($this->app['twitter_api_key'], $this->app['twitter_api_secret'], $_REQUEST['oauth_token'], $_REQUEST['oauth_verifier']);
                    $this->twitter['credentials'] = $twt->getAccessToken($_REQUEST['oauth_verifier']);
                    $this->CI->session->set_userdata('twitter_credentials', $this->twitter['credentials']);

                    // twitter verified
                    if(empty($this->twitter['credentials']['oauth_token'])):
                        throw new Exception("Twitter authentication failed.");
                    endif;
                    
                    $info = $twt->get('account/verify_credentials');
                endif;
                
                //print_r($info);
                $names = explode(' ', $info->name);
                
                // include test to verify user's email address on twitter
                $this->user = array(
                    'twitter_id'=>$info->id,
                    'first_name'=>$names[0],
                    'last_name'=>count($names)>0?$names[count($names)-1]:'',
                    'twitter_access_token'=>$this->twitter['credentials']['oauth_token'],
                    'current_access_token'=>$this->twitter['credentials']['oauth_token'],
                    'verified_token'=>$this->twitter['credentials']['oauth_token'],
                    'email'=>$this->client->EMAIL
                );
                break;
            /*
            case "Google":
                $this->Google = $controller->Components->load('GoogleOauth2');
                $a = $this->app;
                
                $config = array(
                    'client_id'=>$a['google_api_key'],
                    'client_secret'=>$a['google_api_secret'],
                    'redirect_url'=>$this->client->REDIRECT_URL
                );
                
                if(!empty($this->client->scope)):
                    $info = $this->Google->connect($controller, $config, $this->client->SCOPE);
                else:
                    $info = $this->Google->connect($controller, $config);
                endif;
                
                if(!$this->Google->isReady()):
                    throw new Exception("Authentication failed.");
                endif;
                
                // get profile info
                $info = $this->Google->oauth->userinfo->get();
                
                $this->user['email'] = $info->email;
                $this->user['google_id'] = $info->id;
                $this->user['first_name'] = $info->given_name;
                $this->user['last_name'] = $info->family_name;
                $this->user['meta'] = json_encode($info);
                $this->user['profile_photo_url'] = empty($info->picture)?'':$info->picture;
                $this->user['google_profile'] = $info->link;
                $token = json_decode($this->Google->getTokens(), true);
                $this->user['google_access_token'] = $token['access_token'];
                $this->user['current_access_token'] = $token['access_token'];
                $this->user['verified_token'] = $token['access_token'];
                break;
            */  
            case "Yahoo":
                
                $client = new oauth_client_class();
                $client->debug = false;
                $client->debug_http = true;
                $client->server = 'Yahoo';
                $client->client_id = $this->app['yahoo_api_key'];
                $client->client_secret = $this->app['yahoo_api_secret'];
                $client->redirect_uri = $this->client->REDIRECT_URL;
                $application_line = __LINE__;

                if(strlen($client->client_id) == 0
                || strlen($client->client_secret) == 0)
                        /** @TODO Send admin alert for issue with credentials **/
                        /*
                        die('Please go to Yahoo Apps page https://developer.apps.yahoo.com/projects/ , '.
                                'create a project, and in the line '.$application_line.
                                ' set the client_id to Consumer key and client_secret with Consumer secret. '.
                                'The Callback URL must be '.$client->redirect_uri).' Make sure you enable the '.
                                'necessary permissions to execute the API calls your application needs.';
                         */
                         throw new Exception(APP_NAME . " experienced issues connecting with Yahoo. Contact your service administrator.");
                
                $user = $this->yql("select * from social.profile where email='{$this->client->EMAIL}'", 
                        array('FailOnAccessError'=>true), $client);
                
                if(empty($user)):
                    throw new Exception("Your user identity verification failed.");
                endif;
                
                /*
                    stdClass Object ( [profile] => stdClass Object ( [guid] => H7JK3EQZM5ESR3DX6MIR3PBCOI [birthYear] => 1986 [birthdate] => 1/1 [created] => 2009-07-11T22:23:07Z [displayAge] => 27 [emails] => Array ( [0] => stdClass Object ( [handle] => uche.chilaka@ndokoba.com [id] => 7 [type] => HOME ) [1] => stdClass Object ( [handle] => gomeysi@yahoo.co.uk [id] => 8 [primary] => true [type] => HOME ) [2] => stdClass Object ( [handle] => ndokoba@gmail.com [id] => 10 [type] => HOME ) ) [familyName] => Chilaka [gender] => M [givenName] => Uchenna [image] => stdClass Object ( [height] => 192 [imageUrl] => http://l.yimg.com/dh/ap/social/profile/profile_b192.png [size] => 192x192 [width] => 192 ) [interests] => Array ( [0] => stdClass Object ( [declaredInterests] => cycling, computer gaming, reading (something I really should do more of - Im specifically interested in Tom Clancys work - Ive seen a few movies based on his books, and I think hed be very interesting) [interestCategory] => prfFavHobbies ) [1] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavMusic ) [2] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavMovies ) [3] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavFutureMovies ) [4] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavBooks ) [5] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavFutureBooks ) [6] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavQuotes ) [7] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavFoods ) [8] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavPlaces ) [9] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavFuturePlaces ) [10] => stdClass Object ( [declaredInterests] => [interestCategory] => prfFavAelse ) ) [lang] => en-GB [location] => [memberSince] => 2002-06-25T08:24:22Z [nickname] => Uche [profileUrl] => http://profile.yahoo.com/H7JK3EQZM5ESR3DX6MIR3PBCOI [relationshipStatus] => [status] => stdClass Object ( [lastStatusModified] => 2009-08-23T12:41:26Z [message] => Making my sunday :) ) [timeZone] => America/New_York [isConnected] => false ) )                  
                 */
                $this->user = array(
                    'yahoo_id'=>$user->profile->guid,
                    'first_name'=>$user->profile->givenName,
                    'last_name'=>$user->profile->familyName,
                    'email'=>$this->client->EMAIL,
                    'dob'=>date_format(date_create($user->profile->birthYear . '/' . $user->profile->birthdate), "Y-m-d"),
                    'yahoo_profile_link'=>$user->profile->profileUrl,
                    'profile_photo_url'=>$user->profile->image->imageUrl,
                    'timezone'=>$user->profile->timeZone
                );
                $client->GetAccessToken($this->user['yahoo_access_token']);                
                $this->user['yahoo_access_token'] = $this->user['yahoo_access_token']['value'];
                $this->user['current_access_token'] = $this->user['yahoo_access_token'];
                
                break;
            
        endswitch;
        
        if(empty($this->user)):
            throw new Exception("No user data found.");
        endif;
        
        // user data is available
        $this->controller->loadModel('User');
        $this->controller->loadModel('Openid');
        // check if user exists
        $account = $this->controller->User->findByEmail($this->user['email']);
        
        $this->user['exists'] = !empty($account);

        if($this->user['exists']):
            // user exists - update information
            $account['User']['first_name'] = $this->user['first_name'];
            $account['User']['last_name'] = $this->user['last_name'];

            // capture current token
            // $account['User']['current_access_token'] = $this->user['current_access_token'];
            $account['User']['verified_token'] = $this->user['current_access_token'];
            // remove password from update
            unset($account['password']);
        else:    
            // new user
            $account['User'] = $this->user;
            // default password
            $account['User']['password'] = $this->controller->User->randomString(8);
        endif;

        $this->controller->User->create($account['User']);
        // set id if user exists
        if($this->user['exists']):
            $this->controller->User->set("id", $account['User']['id']);
            $saveduser = $this->controller->User->save(null, false, $this->userUpdateFields);
        else:
            $saveduser = $this->controller->User->save(null, false);
            /** @TODO  notify new user */
        endif;

        $this->user['saved'] = $saveduser;

        $this->openid = array(
            'user_id'=>$saveduser['User']['id'],
            'current_access_token'=>$this->user['current_access_token']
        );
        
        switch($this->client->SERVER):
            case 'Facebook':
                $this->openid['fb_id'] = $this->user['fb_id'];
                $this->openid['fb_access_token'] = $this->user['fb_access_token'];
                break;

            case "Linkedin":
                $this->openid['linkedin_id'] = $this->user['linkedin_id'];
                $this->openid['linkedin_access_token'] = $this->user['linkedin_access_token'];
                break;

            case "Twitter":
                $this->openid['twitter_id'] = $this->user['twitter_id'];
                $this->openid['twitter_access_token'] = $this->user['twitter_access_token'];
                break;
            
            case "Google":
                $this->openid['google_id'] = $this->user['google_id'];
                $this->openid['google_access_token'] = $this->user['google_access_token'];
                $this->openid['profile_photo_url']  = $this->user['profile_photo_url'];
                $this->openid['google_profile'] = $this->user['google_profile'];
                // add fields to update to Openid
                $this->openIdUpdateFields = array_merge($this->openIdUpdateFields, array('google_profile', 'profile_photo_url'));
                break;
            
            case "Yahoo":
                $this->openid['yahoo_id'] = $this->user['yahoo_id'];
                $this->openid['yahoo_access_token'] = $this->user['yahoo_access_token'];
                break;
            
        endswitch;

        // setup openid
        $saved_openid = $this->controller->Openid->findByUserId($saveduser['User']['id']);
        $this->user['openid_exists'] = !empty($saved_openid);
        $this->controller->Openid->create($this->openid);

        if($this->user['openid_exists']):
            // Openid Exists
            $this->controller->Openid->set("id", $saved_openid['Openid']['id']);
            $saved_openid = $this->controller->Openid->save(null, false, $this->openIdUpdateFields);
        else:
            $saved_openid = $this->controller->Openid->save(null, false);
        endif;

        // capture saved OpenId
        $this->user['saved']['Openid'] = $saved_openid['Openid'];
        // login and redirect user
        $saveduser['Openid'] = $saved_openid['Openid'];
        //print_r($saved_openid);
        //exit;
        
        $this->controller->request->data = $saveduser;
        $this->controller->Auth->login($saveduser['User']);
        //$this->controller->Auth->login();

        if($this->controller->Auth->loggedIn()):
            // capture signup
            $signup = $this->controller->Signup->find('first', array(
                'conditions'=>array(
                    'Signup.user_id'=>$saveduser['User']['id'],
                    'Signup.application_id'=>$this->app['id']
                )
            ));
            if(empty($signup)):
                // init signup
                $this->controller->Signup->save(array(
                    'user_id'=>$saveduser['User']['id'],
                    'application_id'=>$this->app['id'],
                    'domain'=>$this->app['domain']
                ), false);
            endif;
        
            if($hijack && !empty($redirect)):
                // redirect to landing
                redirect($redirect);
            else:
                // successful login
                redirect($this->controller->Auth->loginRedirect);
            endif;
        endif;
    }
    
    function yql($yql, $params, OAuthDelegate $client, $type='GET', $endpoint='http://query.yahooapis.com/v1/yql') {
        if(($success = $client->Initialize()))
        {
                if(($success = $client->Process()))
                {
                        if(strlen($client->access_token))
                        {

                            $success = $client->CallAPI(
                                    $endpoint, 
                                    $type, array(
                                            'q'=>$yql,
                                            'format'=>'json'
                                    ), $params, $response);
                        }
                }
                $success = $client->Finalize($success);
                // include guid match
        }
        if($client->exit)
                throw new Exception('The OAuthDelegate client has exited.');

        if(strlen($client->authorization_error))
        {
                $client->error = $client->authorization_error;
                $success = false;
        }
        // verify user
        if($success)
        {
            return $response->query->results;
        }
        else
        {
            return $client->error;
        }
    }
        
}

