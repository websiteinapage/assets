<?php    

function checkColor() {
    $r = intval($_REQUEST['r']);
    $g = intval($_REQUEST['g']);
    $b = intval($_REQUEST['b']);
    return ($r<=255 && $g <= 255 && $b <= 255);
}
/*
 * PHP QR Code encoder
 *
 * Exemplatory usage
 *
 * PHP QR Code is distributed under LGPL 3
 * Copyright (C) 2010 Dominik Dzienia <deltalab at poczta dot fm>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */
    
//    echo "<h1>PHP QR Code</h1><hr/>";

/* ENABLE THIS BLOCK!
require_once "../engine/config.php";
require_once "../classes/connection.php";
require_once "../classes/table.php";
global $config;
*/


// testing
if (empty($_REQUEST['data'])) {
    $_REQUEST['data']="http://www.google.com";
    $_REQUEST['size']=10;
}
    
    //set it to writable location, a place for temp generated PNG files
    $PNG_TEMP_DIR = dirname(__FILE__).DIRECTORY_SEPARATOR.'temp'.DIRECTORY_SEPARATOR;
    //$PNG_TEMP_DIR = 'pngtemp/'; 
    
    //html PNG location prefix
    $PNG_WEB_DIR = 'temp/';

    include "qrlib.php";    
    
    //ofcourse we need rights to create temp dir
    if (!file_exists($PNG_TEMP_DIR))
        mkdir($PNG_TEMP_DIR);
    
    
    $filename = $PNG_TEMP_DIR.'test.png';
    
    //processing form input
    //remember to sanitize user input in real-life solution !!!
    $errorCorrectionLevel = 'L';
    if (isset($_REQUEST['level']) && in_array($_REQUEST['level'], array('L','M','Q','H')))
        $errorCorrectionLevel = $_REQUEST['level'];    

    $matrixPointSize = 50;
    //$matrixPointSize = 10;
    if (isset($_REQUEST['size']))
        $matrixPointSize = min(max((int)$_REQUEST['size'], 1), 50);


    if (isset($_REQUEST['data'])) { 
    
        //it's very important!
        if (trim($_REQUEST['data']) == '')
            die('data cannot be empty! <a href="?">back</a>');
            
        // user data
        $filename = $PNG_TEMP_DIR.'test'.md5($_REQUEST['data'].'|'.$errorCorrectionLevel.'|'.$matrixPointSize).'.png';
        @unlink($filename);
        QRcode::png($_REQUEST['data'], $filename, $errorCorrectionLevel, $matrixPointSize, 2);    

        //display generated file
        $file=$PNG_WEB_DIR.basename($filename);
        $sfile=$PNG_WEB_DIR."gauss_".basename($filename);
        
        // blur factor
        $i=10;
        $i=min(20,$matrixPointSize);
        $i=max(5,$i);
        
        $imgsize = getimagesize($filename);
        // get png-8 image 
        $img = imagecreatetruecolor($imgsize[0],$imgsize[1]);
        $imgsrc = imagecreatefrompng($filename);
        // convert to png-24
        imagecopy($img,$imgsrc,0,0,0,0,$imgsize[0],$imgsize[1]);
        
        // distort image with smooth edges
        while ($i--) 
            imagefilter($img, IMG_FILTER_GAUSSIAN_BLUR);
        
        imagefilter($img, IMG_FILTER_CONTRAST,-100);
        
        //TODO: add logo or other labels here
        $ximp = 0.75 * $imgsize[0];
        $yimp = 0.75 * $imgsize[1];
        // determine label based on passed tag number
        $surr_id = $_REQUEST['s'];
        /*
        // check if label passed
        if (!empty($_REQUEST['label'])) {
            $string = $_REQUEST['label'];
            $font=8;
            $f_width = imagefontwidth($font)* strlen($string) ;
            $f_height = imagefontheight($font) ;            
            $im = imagecreatetruecolor($f_width, $f_height);
            imagefill($im, 0, 0, 255, 255, 255);
            //$backgroundColor = imagecolorallocate ($im, 255, 255, 255);   //white background
            $textColor = imagecolorallocate ($im, 0, 0, 0);   //black text
            imagestring ($im, $font, 0, 0,  $string, $textColor, $backgroundColor);
            // overlay image
            imagecopymerge($img, $im, $ximp-$f_width, $yimp-$f_height, 0, 0, $f_width, $f_height, 100);
        }*/
        
        
        
        // merge with label if there is a surrougate id
        if ($surr_id>0) { 
            $lbl = "imgs/{$surr_id}_label.png";
            $labelsize = getimagesize($lbl);
            //$numlabel = imagecreatetruecolor($labelsize[0], $labelsize[1]);
            //imagecopy($numlabel,imagecreatefrompng($lbl),0,0,0,0,$xwidth,$yheight);
            $numlabel = imagecreatefrompng($lbl);
            $numtgt = imagecreatetruecolor($labelsize[0]-1, $labelsize[1]-1);
            imagecolortransparent($numtgt, imagecolorat($numtgt,0,0));
            imagecopyresampled($numtgt, $numlabel, 1, 1, 1, 1, 0.17*$imgsize[0], 0.17*$imgsize[1], $labelsize[0]-1, $labelsize[1]-1);
            // overlay image
            imagecopymerge($img, $numtgt, $ximp, $yimp, 0, 0, $labelsize[0], $labelsize[1], 100);
        }
        
        // check if color passed
        if (checkColor()) {
            imagefilter($img, IMG_FILTER_COLORIZE, $_REQUEST['r'],$_REQUEST['g'],$_REQUEST['b']);
        }
        // drop the white and make it transparent
        imagecolortransparent($img, imagecolorat($img,0,0));

        $type = 'image/png';
        header('Content-Type:'.$type);
        imagepng($img,null);
        imagedestroy($img);

    } else {    
    /*
        //default data
        echo 'You can provide data in GET parameter: <a href="?data=like_that">like that</a><hr/>';    
        QRcode::png('PHP QR Code :)', $filename, $errorCorrectionLevel, $matrixPointSize, 2);    
     */   
    }    
        
    /*
    //config form
    echo '<form action="index.php" method="post">
        Data:&nbsp;<input name="data" value="'.(isset($_REQUEST['data'])?htmlspecialchars($_REQUEST['data']):'PHP QR Code :)').'" />&nbsp;
        ECC:&nbsp;<select name="level">
            <option value="L"'.(($errorCorrectionLevel=='L')?' selected':'').'>L - smallest</option>
            <option value="M"'.(($errorCorrectionLevel=='M')?' selected':'').'>M</option>
            <option value="Q"'.(($errorCorrectionLevel=='Q')?' selected':'').'>Q</option>
            <option value="H"'.(($errorCorrectionLevel=='H')?' selected':'').'>H - best</option>
        </select>&nbsp;
        Size:&nbsp;<select name="size">';
        
    for($i=1;$i<=10;$i++)
        echo '<option value="'.$i.'"'.(($matrixPointSize==$i)?' selected':'').'>'.$i.'</option>';
        
    echo '</select>&nbsp;
        <input type="submit" value="GENERATE"></form><hr/>';
        
    // benchmark
    QRtools::timeBenchmark();    
*/
    