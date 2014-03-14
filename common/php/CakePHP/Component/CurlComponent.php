<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CurlComponent
 *
 * @author uchilaka
 */
App::uses('Component', 'Controller');
class CurlComponent extends Component { 
  /*
  * @author Keith Kurson (delusions@gmail.com)
  * @date September 09, 2006
  * @version 1.0
  */
     /*
     * Headers
     */
     var $headers;
     /*
     * User Agent
     */
     var $user_agent;
     /* 
     * Compression 
     */
     var $compression;
     /*
     * Cookie File
     */
     var $cookie_file;
     /* 
     * Proxy Server
     * ip:port
     */
     var $proxy;
     /* 
     * Initiate the class
     */
     var $lte_headers;
     var $encType = "application/x-www-form-urlencoded";
     
     function initialize(Controller $controller) {
        $cookies=FALSE;
        $cookie="files/cookies.txt";
        $compression='gzip'; 
        $proxy='';
        $this->headers[] = "Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg, text/json, text/plain, text/html";
        $this->headers[] = "Connection: Keep-Alive";
        // $this->headers[] = "Content-type: application/x-www-form-urlencoded";
        $this->user_agent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0)";
        $this->compression=$compression;
        $this->proxy=$proxy;
        $this->cookies=$cookies;
        if ($this->cookies == TRUE) $this->cookie($cookie); 
     }
     
     function setEncryptionType($type) {
         $this->encType = $type;
     }
     
     function parseEncryptionType() {
         $this->headers[] = "Content-type: {$this->encType}";
         $this->lte_headers[] = "Content-type: {$this->encType}";
     }
     
     /* 
     * Tests the Cookie File
     */ 
     function cookie($cookie_file) {
          if (file_exists($cookie_file)) {
                $this->cookie_file=$cookie_file;
          } else { 
                @fopen($cookie_file,'w') or $this->error("The cookie file could not be opened. Make sure this directory has the correct permissions");
                $this->cookie_file=$cookie_file;
                fclose($cookie_file);
          }
     }
     /*
     * Runs a GET through cURL
     */
     function get($url,$refer='') {
          $this->parseEncryptionType();
          $process = curl_init($url);
          curl_setopt($process, CURLOPT_REFERER, $refer);
          curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers);
          curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent);
          if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEFILE, $this->cookie_file);
          if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEJAR, $this->cookie_file);
          curl_setopt($process,CURLOPT_ENCODING , $this->compression);
          curl_setopt($process, CURLOPT_TIMEOUT, 30);
          if ($this->proxy) curl_setopt($cUrl, CURLOPT_PROXY, 'proxy_ip:proxy_port');
          curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
          $return = curl_exec($process);
          curl_close($process);
          return $return;
     }
     /* 
     * Runs a POST through cURL
     */
     function simple_post($url, $data=null) {
        $curler = curl_init();
        curl_setopt($curler, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($curler, CURLOPT_URL, $url);
        curl_setopt($curler, CURLOPT_POST, 1);
        curl_setopt($curler, CURLOPT_RETURNTRANSFER, 1);
        if(!empty($data)):
            if(!is_array($data)):
                throw new Exception("BAD Request Parameters");
            endif;
            curl_setopt($curler, CURLOPT_POSTFIELDS, http_build_query($data));
        endif;
        return curl_exec($curler);
     }
     
     function simple_get($url, $data=null) {
        $curler = curl_init();
        curl_setopt($curler, CURLOPT_HTTPHEADER, $this->headers);
        if(!empty($data)):
            if(!is_array($data)):
                throw new Exception("BAD Request Parameters");
            endif;
            curl_setopt($curler, CURLOPT_URL, $url . "?" . http_build_query($data));
        else:
            curl_setopt($curler, CURLOPT_URL, $url);
        endif;
        curl_setopt($curler, CURLOPT_RETURNTRANSFER, 1);
        return curl_exec($curler);
     }
     
     function post($url,$data,$refer,$lte=false) {
          $this->parseEncryptionType();
          $process = curl_init($url);
          if(!$lte):
            curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers);
            curl_setopt($process, CURLOPT_REFERER, $refer);
            if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEFILE, $this->cookie_file);
            if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEJAR, $this->cookie_file);
            curl_setopt($process, CURLOPT_ENCODING , $this->compression);
            if ($this->proxy) curl_setopt($cUrl, CURLOPT_PROXY, 'proxy_ip:proxy_port');
            curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);
          else:
            curl_setopt($process, CURLOPT_HTTPHEADER, $this->lte_headers);
          endif;
          curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent);
          curl_setopt($process, CURLOPT_TIMEOUT, 30);
          curl_setopt($process, CURLOPT_POSTFIELDS, $data);
          curl_setopt($process, CURLOPT_POST, 1);
          $return = curl_exec($process);
          curl_close($process);
          return $return;
     }
     /*
     * Error Output
     */
     function error($error) {
          echo "<center><div style='width:500px;border: 3px solid #FFEEFF; padding: 3px; background-color: #FFDDFF;font-family: verdana; font-size: 10px'><b>cURL Error</b><br>$error</div></center>";
          die;
     }
}
?>
