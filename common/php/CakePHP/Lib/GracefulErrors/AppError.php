<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AppError
 *
 * @author uchilaka
 */
class AppError {
    
    public $code;
    public $description;
    public $file;
    public $line;
    public $context;
    
    public function __construct($code, $description, $line=null, $file=null, $context=null) {
        $this->code = $code;
        $this->description = $description;
        $this->file = $file;
        $this->line = $line;
        $this->context = $context;
    }
    
}
