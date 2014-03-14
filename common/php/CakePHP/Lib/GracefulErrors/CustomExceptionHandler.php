<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Description of CustomExceptionHandler
 *
 * @author uchilaka
 */

class CustomExceptionHandler {
    
    public static function handleException($error) {
        $template = APP . 'Lib/GracefulErrors/error_template.ctp';
        header('Content-type: text/html');
        //$content = 'Oh noes! ' . $error->getMessage();
        $title = "Oops! Something broke.";
        include $template;
        //echo file_get_contents();
    }
    
    public function get_content() {
        echo "It works!";
    }
    
}
