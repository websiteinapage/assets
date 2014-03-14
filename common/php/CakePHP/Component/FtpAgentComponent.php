<?php

class FtpAgentComponent extends Component {
    
    const MZMA_PHOTOS = "mediazuma_photos";
    const MZMA_PHOTOS_USER = 'mzma_photos@websiteinapage.com';
    const MZMA_PHOTOS_PW = 'sw3etThinGs?';
    const MZMA_FTP_DIR = 'data/';
    
    public $components = array('Directory');
    
    function initialize(\Controller $controller) {
        parent::initialize($controller);
    }
    
    function send($host, $file, $sendto, $port=21, $timeout=30) {
        switch($sendto):
            case self::MZMA_PHOTOS:
                
                $newfile = self::MZMA_PHOTOS . "_" . gmdate("Y-m-d_H.i.s") . ".". $this->Directory->file_type($file);
                if(LOCAL_MODE):
                    $dest = APP . "../../mediazuma/image/" . self::MZMA_FTP_DIR;
                    $this->Directory->make_file($dest, $newfile, file_get_contents($file));
                    return array('status'=>1, 'file'=>self::MZMA_FTP_DIR . $newfile);
                else:
                    $conn = ftp_connect($host, $port, $timeout);
                    if(!$conn):
                        throw new Exception("Could not connect");
                    endif;
                    $login = ftp_login($conn, self::MZMA_PHOTOS_USER, self::MZMA_PHOTOS_PW);
                    if(!$login):
                        throw new Exception('Login Failed');
                    endif;
                    ftp_set_option($conn, FTP_TIMEOUT_SEC, 25);
                    //$upload = ftp_put($conn, $newfile, $file, FTP_ASCII);
                    $upload = ftp_put($conn, $newfile, $file, FTP_BINARY);
                    ftp_close($conn);
                    if(!$upload):
                        throw new Exception('Upload failed.');
                    endif;
                endif;
                
                return array('status'=>$upload, 'file'=>self::MZMA_FTP_DIR . $newfile);
        endswitch;
    }
    
}
