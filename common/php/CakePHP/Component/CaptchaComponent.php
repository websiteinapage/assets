<?php  

App::import('Vendor', 'PhpCaptcha', array('file'=>'php-captcha.inc.php'));

class CaptchaComponent extends Component 
{ 
    var $controller; 
    var $useColor;
    
    // public $components = array('RequestHandler');
    
    function startup(\Controller $controller) {
        $this->controller = $controller;
        $this->useColor = false;
        parent::startup($controller);
    }
    
    function setUseColor($useColor) {
        $this->useColor = $useColor;
    }

    function image(){ 
        // $imagesPath =  APP . 'Vendor' . DS . 'phpcaptcha/fonts/';
        $imagesPath =  ABS_ROOT . 'assets' . DS . 'common' . DS . 'php' . DS . 'phpcaptcha' . DS . 'fonts' . DS;
        // echo $imagesPath;
        
        $aFonts = array( 
            $imagesPath.'VeraBd.ttf', 
            $imagesPath.'VeraIt.ttf', 
            $imagesPath.'Vera.ttf' 
        ); 
        //print_r($aFonts);
        
        $oVisualCaptcha = new PhpCaptcha($aFonts, 200, 60); 
        $oVisualCaptcha->UseColour($this->useColor); 
        //$oVisualCaptcha->SetOwnerText('Source: '.FULL_BASE_URL); 
        $oVisualCaptcha->SetNumChars(6); 
        $oVisualCaptcha->Create(); 
        
        // $this->RequestHandler->setContent('image/jpeg');
        // $this->RequestHandler->respondAs('image/jpeg');
    } 
     
    function audio(){ 
        $oAudioCaptcha = new AudioPhpCaptcha('/usr/bin/flite', '/tmp/'); 
        $oAudioCaptcha->Create(); 
    } 
     
    function check($userCode, $caseInsensitive = true){ 
        if ($caseInsensitive) { 
            $userCode = strtoupper($userCode); 
        } 
         
        if (!empty($_SESSION[CAPTCHA_SESSION_ID]) && $userCode == $_SESSION[CAPTCHA_SESSION_ID]) { 
            // clear to prevent re-use 
            unset($_SESSION[CAPTCHA_SESSION_ID]); 
             
            return true; 
        } 
        else  {
            return false; 
        }
         
    } 
} 
