<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title><?php echo $title; ?></title>
        <link href="<?php echo APP_BASE . "img/favicon.ico"; ?>" rel="icon" type="image/x-icon" /> 
        <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
        <meta name="author" content="Website In A Page LLC">
        <link rel="stylesheet" href="<?php echo APP_COMMON_BASE . "jquery-ui/css/cupertino/jquery-ui-1.10.3.custom.min.css"; ?>" />
        <!--[if lte IE 8]><script src="<?php echo APP_COMMON_BASE; ?>js/html5shiv.js"></script><![endif]-->
        <script src="<?php echo APP_COMMON_BASE . "js/jsfxns.js"; ?>"></script>
                <script src="<?php echo APP_COMMON_BASE . "jquery-ui/js/jquery-1.9.1.js"; ?>"></script>
                <script src="<?php echo APP_COMMON_BASE . "jquery-ui/js/jquery-ui-1.10.3.custom.min.js"; ?>"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/console.failsafe.js"; ?>"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/spin.min.js"; ?>"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/ajax.config.js"; ?>"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/skel.min.js"; ?>">
            {
                prefix: "<?php echo APP_BASE . "css/style"; ?>",
                resetCSS: false,
                boxModel: "border",
                grid: { gutters: 10 },
                breakpoints: {
                  wide: { range: "1000-", containers: 980, grid: { gutters: 50 } },
                  narrow: { range: "601-999", containers: 950 },
                  mobile: { range: "-600", containers: "fluid", lockViewport: true, grid: { collapse: true } }
                }                        
            }
        </script>
        <script src="<?php echo APP_COMMON_BASE . "js/jquery.scrollTo-1.4.3.1-min.js"; ?>"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/underscore.js"; ?>" type="text/javascript"></script>
        <script src="<?php echo APP_COMMON_BASE . "js/backbone.js"; ?>" type="text/javascript"></script>
        <link rel="stylesheet" href="<?php echo APP_BASE . "css/zeus.lte.css"; ?>" />
        <style type="text/css">
            body {
                background: #fff;
                color: #2a2a2a;
                font-size: 1.3em;
                font-family: Helvetica, sans-serif, Verdana;
            }
            .logo {
                /*display: block;*/
                float: left;
                margin: 1em;
            }
            #error-text {
                display: inline-block;
                width: 80%;
            }
            .solid {
                font-weight: bolder;
            }
            h1 {
                color: inherit;
                font-size: 2.5em;
                margin: 0 0 0.8em 0;
            }
        </style>
    </head>
    <body>
        <div class="inner-content">
            <div class="center-box">
                <?php 
                
                $title = "Darn. Something broke.";
                $msg = "That's all we know, unfortunately.";
                if(!empty($error)):
                    switch($error->getCode()):
                        case 404:
                            $title = "Hmm... I can't find the page you're looking for.";
                            $msg = "It's either alien, classified or restricted.";
                            break;
                        
                        case 500:
                            $title = "It looks like it's on us.";
                            break;
                        
                        case 501:
                            $title = "It's sumthin'! - but it ain't here.";
                            $msg = "Looks like 'Not Implemented' is the verdict: {$code}.";
                            break;
                        
                        case 405:
                            $title = "Well, that's not allowed.";
                            $msg = "Don't shoot the messanger: {$code}";
                            break;
                        
                        case 403:
                            $title = "Well, that's forbidden.";
                            $msg = "Don't shoot the messanger: {$code}";
                            break;
                        
                        default:
                            $msg = $error->getMessage();
                            break;
                    endswitch;
                endif;
                ?>
                <img class="logo" src="<?php echo APP_BASE . "img/32 X 32.png"; ?>" /> 
                <div id="error-text">
                    <h1><?php echo $title; ?></h1>
                    <?php
                    echo $msg;
                    
                    // comment out this piece in production
                    if(!preg_match('/websiteinapage.com/', $_SERVER['HTTP_HOST'])):
                        if(!empty($error)):
                            echo "<p />" . $error->getMessage();
                            echo "<p />" . nl2br($error->getTraceAsString());
                        endif;
                        
                        // show and clear queued errors
                        if(!empty($_SESSION['errors'])):
                            foreach($_SESSION['errors'] as $err):
                                echo "{$err->description} <br /><em>@ line #{$err->line}</em><p />";
                            endforeach;
                            //print_r($_SESSION['errors']);
                            unset($_SESSION['errors']);
                        endif;
                    endif;
                    
                    //echo $content;
                    ?>
                </div>
            </div>
        </div>
    </body>
    <script type="text/javascript">
        $(document).ready(function() {
            $('.center-box').position({
                my: "center",
                at: "center",
                of: $(window)
            });
        });
    </script>
</html>
