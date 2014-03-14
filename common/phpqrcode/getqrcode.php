<?php    
// split rgb to components
function rgb_to_array($rgb) {
    $a[0] = ($rgb >> 16) & 0xFF;
    $a[1] = ($rgb >> 8) & 0xFF;
    $a[2] = $rgb & 0xFF;

    return $a;
}

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
    
    $color = array(max(0, $_REQUEST['r']), max(0,$_REQUEST['g']), max(0, $_REQUEST['b']));
    
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
        
        $colorInverted = false;
    
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
        
        // calculate possible font size
        $font=$_REQUEST['size']*0.45;
        $f_height = imagefontheight($font)+2 ; 
        
        $imgsize = getimagesize($filename);
        // get png-8 image 
        $img = imagecreatetruecolor($imgsize[0],$imgsize[1]+$f_height);
        imagefill($img, 0, 0, imagecolorallocate($img,255,255,255));
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
        
        // merge with label if there is a surrougate id
        /*
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
        }*/
        
        // drop the white and make it transparent
        // imagecolortransparent($img, imagecolorat($img,0,0));
        
        // check if label passed
        if (!empty($_REQUEST['label'])) {
            $string = $_REQUEST['label'];
            $f_width = imagefontwidth($font)* strlen($string)+2 ;
            $im = imagecreatetruecolor($f_width, $f_height);
            $backgroundColor = imagecolorallocate ($im, 255, 255, 255);   //white background
            imagefill($im, 0, 0, $backgroundColor);
            $textColor = imagecolorallocate ($im, $_REQUEST['r'], $_REQUEST['g'], $_REQUEST['b']);   //black text
            /** Using TTF font
            // Set the enviroment variable for GD
            putenv('GDFONTPATH=' . realpath('.'));
            $fontfile = "CALIBRI";
            //imagettftext($im, 12, 0, 0, 0, $textColor, 'Arial', $string);
             * 
             */
            imagestring($im, $font, 1, 1,  $string, $textColor);
            
            /*
            // overlay image
            $imgcenter = array(
                $imgsize[0]/2,$imgsize[1]/2
            );
            imagecopymerge($img, $im, $imgcenter[0]-($f_width/2), $imgcenter[1], 0, 0, $f_width, $f_height, 100);
             */
            
            // put at bottom left
            $imgcenter = array(
                $imgsize[0]+10,
                0
            );
            imagecopymerge($img, $im, 10, $imgsize[1], 0, 0, $f_width, $f_height, 100);
        }
        // get width and height of image
        $size_x = imagesx($img);
        $size_y = imagesy($img);
            
        // alter the color if requested
        if($_REQUEST['InvertColor']):
            $imgx = imagecreatetruecolor($size_x, $size_y);
            $backgroundColor = imagecolorallocate ($im, 255, 255, 255);   //white background
            //$fillRed = imagecolorallocate($img, 255, 0, 0);
            imagefill($imgx, 0, 0, $backgroundColor);
            //imagefill($img, 0, 0, $fillRed);
            $colorInverted = true;
            
            // scan image pixels
            for ($x = 0; $x < imagesx($img); $x++) {
                for ($y = 0; $y < imagesy($img); $y++) {
                    $src_pix = imagecolorat($img,$x,$y);
                    $src_pix_array = rgb_to_array($src_pix);

                        // check for chromakey color
                        if (! ($src_pix_array[0] == 0 && $src_pix_array[1] == 0 && $src_pix_array[2] == 0)) {
                            $src_pix_array[0] = 255; $src_pix_array[1] = 255; $src_pix_array[2] = 255;
                        }
                    imagesetpixel($imgx, $x, $y, imagecolorallocate($imgx, $src_pix_array[0], $src_pix_array[1], $src_pix_array[2]));
                }
            }
            imagecopyresampled($img, $imgx, 0, 0, 0, 0, $size_x, $size_y, $size_x, $size_y);
            // set black to transparent
            imagecolortransparent($img, imagecolorallocate($img, 0, 0, 0));
        else:
            // set white to transparent
            imagecolortransparent($img, imagecolorallocate($img, 255, 255, 255));
        endif;

        // check if color passed
        if (checkColor()) {
            imagefilter($img, IMG_FILTER_COLORIZE, $_REQUEST['r'],$_REQUEST['g'],$_REQUEST['b']);
        }
        
        $type = 'image/png';
        header('Content-Type:'.$type);
        
        if($_REQUEST['FlipHorizontal']):
            $nimg = imagecreatetruecolor($size_x, $size_y);
            imagecopyresampled($nimg, $img, 0, 0, ($size_x-1), 0, $size_x, $size_y, 0-$size_x, $size_y);
            if(!$colorInverted):
                // set white to transparent
                imagecolortransparent($nimg, imagecolorallocate($nimg, 255, 255, 255));
            else:
                // set white to transparent
                imagecolortransparent($nimg, imagecolorallocate($nimg, $color[0], $color[1], $color[2]));
            endif;
            imagepng($nimg, null);
            imagedestroy($nimg);
            
        else:
            imagepng($img,null);
            imagedestroy($img);
        endif;
        

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
    