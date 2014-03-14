<?php
// Requires App::build() to include Google's Client API directories

/** @filesource Server path to vendor directory - used to import client library **/
$PHP_VENDOR_BASE = str_replace('/CakePHP/Component', '', __DIR__) . DS;
require_once $PHP_VENDOR_BASE . 'google' . DS . 'google-api-php-client' . DS . 'src' . DS . "Google_Client.php";
require_once $PHP_VENDOR_BASE . 'google' . DS . 'google-api-php-client' . DS . 'src' . DS . "contrib" . DS . "Google_DriveService.php";
require_once $PHP_VENDOR_BASE . 'google' . DS . 'google-api-php-client' . DS . 'src' . DS . "contrib" . DS . "Google_Oauth2Service.php";

App::uses('Component', 'Controller');
App::uses('Application', 'Model');

class GoogleDriveComponent extends Component {
    
    public $controller;
    public $google;
    public $service;
    public $oauth;
    private $config;
    private $app;
    private $user;
    public $redirect_url;
    private $ready = false;
    const PERMISSION_PUBLIC = "public";
    const PERMISSION_PRIVATE = "private";
    
    public function initialize(\Controller $controller) {
        parent::initialize($controller);
        $this->controller = $controller;
    }
    
    public function connect(\Controller $controller, $config, $api_mode=false) {
        $this->google = new Google_Client();
        $this->config = $config;
        $this->google->setClientId($config['client_id']);
        $this->google->setClientSecret($config['client_secret']);
        $this->google->setRedirectUri($config['redirect_url']);
        $this->google->setScopes(array(
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive', 
            'https://www.googleapis.com/auth/drive.file'));
        $this->google->setUseObjects(true);
        if(!empty($_REQUEST['code'])):
            $this->authenticate($controller, $_REQUEST['code']);
            // if it makes it here
            $this->ready = true;
        else:    
            $this->service = new Google_DriveService($this->google);
            $this->oauth = new Google_Oauth2Service($this->google);
            if($this->getTokens()):
                $this->google->setAccessToken($this->getTokens());
                if($api_mode):
                    $userinfo = $this->verify_credentials($controller, $this->getTokens(), $api_mode);
                    if(!empty($userinfo)):
                        $this->ready = true;
                    endif;
                    return array('success'=>$this->ready);
                else:
                    $userinfo = $this->verify_credentials($controller, $this->getTokens(), $api_mode);
                    // if it makes it here
                    if(!empty($userinfo)):
                        $this->ready = true;
                    endif;
                endif;
            else:
                if($api_mode):
                    return array('success'=>false);
                else:
                    $controller->redirect($this->getAuthUrl());
                endif;
            endif;
        endif;
    }
    
    private function authenticate(\Controller $controller, $code) {
        $this->service = new Google_DriveService($this->google);
        $this->oauth = new Google_Oauth2Service($this->google);
        $token = $this->google->authenticate($code);
        $this->google->setAccessToken($token);
        $this->userinfo = $this->verify_credentials($controller, $token);
        if(!empty($this->userinfo)):
            $this->setTokens($token);
            $this->setUserId($this->user['id']);
            $this->ready = true;
            // send to application
            $controller->redirect($this->config['redirect_url']);
        else:
            $controller->redirect($this->getAuthUrl());
        endif;
        
    }
    
    public function verify_credentials(\Controller $controller, $credentials, $api_mode=false) {
        // TODO: Use the oauth2.tokeninfo() method instead once it's
        //       exposed by the PHP client library
        $this->google->setAccessToken($credentials);
        try {
          return $this->oauth->userinfo->get();
        } catch (Google_ServiceException $e) {
            if ($e->getCode() == 401) {
                  // This user may have disabled the Glassware on MyGlass.
                  // Clean up the mess and attempt to re-auth.
                  $this->cleanUser();
                  if($api_mode):
                      return array('success'=>false, 'message'=>$e->getMessage());
                  else:
                       $controller->redirect($this->getAuthUrl());
                  endif;
                  // $controller->redirect($this->config['redirect_url']);
                  // echo $this->getAuthUrl();
                  // exit;
            } else {
                  // Let it go...
                  // throw $e;
                  if($api_mode):
                      return array('success'=>false, 'message'=>$e->getMessage());
                  else:
                      throw $e;
                  endif;
            }
        }
    }
    
    public function isReady() {
        return $this->ready;
    }
    /*
    public function setUser($tokens) {
        $_SESSION["gd_user"] = json_encode(array(
          'tokens' => json_decode($tokens, true)
        ));
    }
     */
    
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
    
    private function setUserId($id) {
        $_SESSION['gd_user']['id'] = $id;
    }
    
    function getUser() {
        if (isset($_SESSION["gd_user"])) {
          return $_SESSION["gd_user"];
        }
    }
    
    private function getUserId() {
        if(empty($_SESSION['gd_user'])):
            throw new Exception("No user ID found in session.");
        endif;
        
        return $_SESSION['gd_user']['id'];
    }
    
    private function setTokens($token) {
        $_SESSION['gd_tokens'] = $token;
    }
    
    public function cleanUser() {
        unset($_SESSION['gd_user']);
        unset($_SESSION['gd_tokens']);
    }
    
    public function getTokens() {
        if(!empty($_SESSION['gd_tokens'])):
            return $_SESSION['gd_tokens'];
        endif;
    }
    
    public function copyFile($originFileId, $copyTitle, $parentId=null, $allow=self::PERMISSION_PRIVATE) {
        $copiedFile = new Google_DriveFile();
        $copiedFile->setTitle($copyTitle);
        try {
            // Set the parent folder.
             if ($parentId != null) {
                $parent = new Google_ParentReference();
                $parent->setId($parentId);
                $copiedFile->setParents(array($parent));
             }
            $newFile = $this->service->files->copy($originFileId, $copiedFile);
            
            $permission = new Google_Permission();
            switch($allow):
                case self::PERMISSION_PRIVATE:
                    $permission->setValue('me');
                    $permission->setType('default');
                    $permission->setRole('owner');
                    break;

                default:
                    $permission->setValue('');
                    $permission->setType('anyone');
                    $permission->setRole('reader');
                    break;
            endswitch;
            $this->service->permissions->insert($newFile->getId(), $permission);
            
            return $newFile;
          
        } catch (Exception $e) {
          print "An error occurred: " . $e->getMessage();
        }
        return NULL;
    }
    
    public function newFile($title, $description, $mimeType, $filename, $parentId=null, $allow=self::PERMISSION_PRIVATE) {
        if(!$this->isReady()):
            throw new Exception("Google client is not initialized");
        endif;
        
        $file = new Google_DriveFile();
        $file->setTitle($title);
        $file->setDescription($description);
        $file->setMimeType($mimeType);
        
        // Set the parent folder.
         if ($parentId != null) {
           $parent = new Google_ParentReference();
           $parent->setId($parentId);
           $file->setParents(array($parent));
         }

         try {
           $data = file_get_contents($filename);

           $createdFile = $this->service->files->insert($file, array(
             'data' => $data,
             'mimeType' => $mimeType,
           ));

            $permission = new Google_Permission();
            switch($allow):
                case self::PERMISSION_PRIVATE:
                    $permission->setValue('me');
                    $permission->setType('default');
                    $permission->setRole('owner');
                    break;

                default:
                    $permission->setValue('');
                    $permission->setType('anyone');
                    $permission->setRole('reader');
                    break;
            endswitch;

            $this->service->permissions->insert($createdFile->getId(), $permission);
           
           // Uncomment the following line to print the File ID
           // print 'File ID: %s' % $createdFile->getId();

           return $createdFile;
           
         } catch (Exception $e) {
            throw new Exception("An error occurred: " . $e->getMessage());
         }
    }
    
    public function newDirectory($folderName, $parentId=null, $allow=self::PERMISSION_PRIVATE) {
        $file = new Google_DriveFile();
        $file->setTitle($folderName);
        $file->setMimeType('application/vnd.google-apps.folder');
        
        if(!$this->isReady()):
            throw new Exception("Google client is not initialized");
        endif;
        
        // Set the parent folder.
         if ($parentId != null) {
            $parent = new Google_ParentReference();
            $parent->setId($parentId);
            $file->setParents(array($parent));
         }
        
        $createdFile = $this->service->files->insert($file, array(
            'mimeType'=>'application/vnd.google-apps.folder'
        ));
        
        $permission = new Google_Permission();
        switch($allow):
            case self::PERMISSION_PRIVATE:
                $permission->setValue('me');
                $permission->setType('default');
                $permission->setRole('owner');
                break;
            
            default:
                $permission->setValue('');
                $permission->setType('anyone');
                $permission->setRole('reader');
                break;
        endswitch;
        
        $this->service->permissions->insert($createdFile->getId(), $permission);
        
        return $createdFile;
    }
    
    public function getFiles($pageToken=null, $filters=null) {
        try {
            if(!$this->isReady()):
                throw new Exception("Google client is not initialized");
            endif;
        
            $result = array();
            $errors = array();
            
            try {
                
                if(!empty($filters)):
                    $where = "";
                    
                    foreach($filters as $i=>$filter):
                        if($i>0):
                            $where .= " and {$filter}";
                        else:    
                            $where .= $filter;
                        endif;
                    endforeach;
                    
                    $parameters = array(
                        'q'=>$where,
                        'maxResults'=>50
                    );
                else:
                    $parameters = array(
                        // 'q'=>"mimeType != 'application/vnd.google-apps.folder' and mimeType = 'image/gif' and mimeType = 'image/jpeg' and mimeType = 'image/png'",
                        'q'=>"mimeType != 'application/vnd.google-apps.folder'",
                        'maxResults'=>50
                    );
                endif;
                
                if($pageToken):
                    $parameters['pageToken'] = $pageToken;
                endif;
                
                $files = $this->service->files->listFiles($parameters);
                $result = array_merge($result, $files->getItems());
                $pageToken = $files->getNextPageToken();
                
            } catch (Exception $ex) {
                $pageToken = NULL;
                $errors[] = $ex->getMessage();
            }
            
            /*
            do {
                try {
                    $parameters = array(
                        //'q'=>"mimeType != 'application/vnd.google-apps.folder' and mimeType = 'image/gif' and mimeType = 'image/jpeg' and mimeType = 'image/png'",
                        'q'=>"mimeType != 'application/vnd.google-apps.folder' and mimeType = 'image/png'",
                        'maxResults'=>50
                    );
                    if($pageToken):
                        $parameters['pageToken'] = $pageToken;
                    endif;
                    $files = $this->service->files->listFiles($parameters);
                    $result = array_merge($result, $files['items']);
                    $pageToken = $files['nextPageToken'];
                } catch (Exception $ex) {
                    $pageToken = NULL;
                    $errors[] = $ex->getMessage();
                }
            } while ($pageToken);
             */
            
            // print_r($result);
            
            return array(
                'success'=>true,
                'files'=>$result,
                'nextPageToken'=>$pageToken,
                'errors'=>$errors,
                'parameters'=>$parameters
            );
            
        } catch (Exception $ex) {
            return array('success'=>false, 'message'=>$ex->getMessage());
        }
    }
    
    /** SlidesOnGlass Methods **/
    function getSystemDirectory(\Controller $controller) {
        // find Google Drive system directory
        // define SYSDIR_INDEX (index in Openid META parameter) and FOLDER_SYS constants in application
        
        $meta = json_decode($controller->__openid['Openid']['meta'], true);
        if(!empty($meta[SYSDIR_INDEX])):
            $sysdir_info = $meta[SYSDIR_INDEX];
            if(!empty($sysdir_info['id'])):
                $sysdir = $this->service->files->get($sysdir_info['id']);
            endif;
        endif;

        // if missing system directory
        if(empty($meta[SYSDIR_INDEX]) || empty($sysdir)):
            // setup system folder if NOT EXISTS
            $params = array(
                'q'=>"mimeType = 'application/vnd.google-apps.folder' and title = '" . FOLDER_SYS . "'",
                'maxResults'=>1
            );
            $gquery = $this->service->files->listFiles($params);
            $sysdir = $gquery->getItems();

            // sysdir not found
            if(empty($sysdir[0])):
                // create system directory
                $sysdir = $this->newDirectory(FOLDER_SYS, null, GoogleDriveComponent::PERMISSION_PUBLIC);
            else:
                $sysdir = $sysdir[0];
            endif;

            // print_r($sysdir);

            $sysdir_info = array(
                'id'=>$sysdir->id,
                'name'=>$sysdir->title,
                'description'=>$sysdir->description,
                'mimeType'=>$sysdir->mimeType,
                'webContentLink'=>$sysdir->webContentLink,
            );
            $controller->loadModel('Openid');
            $controller->Openid->set("id", $controller->__openid['Openid']['id']);
            // $meta = json_decode($this->__openid['Openid']['meta'], true);
            $meta[SYSDIR_INDEX] = json_encode($sysdir_info);
            $controller->Openid->saveField("meta", json_encode($meta), false);
        endif;
        
        return $sysdir_info;
    }
    
}
