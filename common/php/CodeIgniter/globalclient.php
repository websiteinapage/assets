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

class Globalclient {
    //put your code here
    public $params;
    public $CLIENT_ID;
    public $CLIENT_SECRET;
    public $SERVER;
    public $REDIRECT_URL;
    public $EMAIL;
    public $SCOPE;
    
    public function __construct( $params ) {
        //$this->params = array('server', 'redirect_url', 'client_id', 'client_secret');
        $this->params = array('server', 'redirect_url');
        
        foreach($this->params as $param):
            if(empty($params[$param])):
                $missing_params[] = $param;
            endif;
        endforeach;
        
        if(!empty($missing_params)):
            throw new Exception("Missing parameters: " . json_encode($missing_params));
        endif;
        
        //$this->CLIENT_ID = $params['client_id'];
        //$this->CLIENT_SECRET = $params['client_secret'];
        $this->SERVER = $params['server'];
        $this->REDIRECT_URL = $params['redirect_url'];
        if(!empty($params['email'])):
            $this->EMAIL = $params['email'];
        endif;
        if(!empty($params['scope'])):
            $this->SCOPE = $params['scope'];
        endif;
    }
    
}
