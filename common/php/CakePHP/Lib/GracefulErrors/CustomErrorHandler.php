<?php
App::import('Lib', 'AppError', array('file'=>'GracefulErrors' . DS . 'AppError.php'));
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CustomErrorHandler
 *
 * @author uchilaka
 */
class CustomErrorHandler {
    
    private $controller;
    
    public static function handleError($code, $description, $file = null,
        $line = null, $context = null) {
        list(, $level) = ErrorHandler::mapErrorCode($code);
        error_reporting(0);
        if ($level === LOG_ERROR) {
            // Ignore fatal error. It will keep the PHP error message only
            return false;
        }
        $err = new AppError($code, $description, $line, $file, $context);
        
        if(empty($_SESSION['errors'])):
            $_SESSION['errors'] = array();
        endif;
        
        $_SESSION['errors'][] = $err;
        
        echo 'There has been an error! ' . $line;
    }
    
}
