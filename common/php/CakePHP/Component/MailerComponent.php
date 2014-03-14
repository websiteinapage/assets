<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MailerComponent
 *
 * @author uchilaka
 */

App::uses('CakeEmail', 'Network/Email');
App::uses('Mandrill', 'Vendor');

class MailerComponent extends Component {
    
    private $ctrl;
    private $config = "default";
    private $variables = array();
    private $template = "default"; 
    private $layout = "default";
    private $signature="";
    public $MAILBOX;
    private $email;
    private $opts = array();
    
    public function initialize(\Controller $controller) {
        parent::initialize($controller);
        $this->ctrl = $controller;
        //$this->config = "mandrill";
        //$this->config = "info";
        //$this->signature = APP_EMAIL_SIGNATURE;
        //$this->template = "email_layout";
        /** @TODO read from the email config **/
        //$this->MAILBOX = "info@websiteinapage.com";
    }
    
    public function setConfig($config) {
        $this->config = $config;
    }
    
    public function setLayout($layout) {
        $this->layout = $layout;
    }
    
    public function setVariables($array) {
        $this->variables = $array;
    }
    
    public function setTemplate($template) {
        $this->template = $template;
    }
    
    public function setDomain($domain) {
        $this->opts['domain'] = $domain;
    }
    
    public function setSignature($signature) {
        $this->signature = $signature;
    }
    
    public function send($to, $subject, $message=null, $mode="default") {
        
        $this->email = new CakeEmail();
        
        if(!empty($this->variables)):
            $this->email->viewVars($this->variables);
        endif;
        
        if(!empty($this->opts['domain'])):
            $this->email->domain($this->opts['domain']);
        endif;
        
        switch($mode):
            case "default":
                $this->email->config($this->config);
                $this->email->template($this->template, $this->layout);
                $this->email->emailFormat('html');
                break;
        endswitch;
        /*
        if(!empty($this->variables)):
            $this->email->viewVars($this->variables);
        endif;
        */
        $recipients = array();
        if(is_array($to)):
            foreach($to as $email):
                $recipients[$email] = $email;
            endforeach;
        else:
            $recipients = $to;
        endif;
        
        $this->email->to($recipients);
        $this->email->subject($subject);
        if(!empty($message)):
            $this->email->send($message . "<br />" . $this->signature);
        else:
            $this->email->send();
        endif;
        
    }
    
}
