<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ZipComponent
 *
 * @author uchilaka
 */
// app/Controller/Component/ZipComponent.php
App::uses('Component', 'Controller');
class ZipComponent extends Component {
    //put your code here
  public function create($destination = '', $files = array(), $overwrite = false) {
    if (file_exists($destination) && !$overwrite) {
      return false;
    }

    $validFiles = array();
    if (is_array($files)) {
      foreach ($files as $file) {
        if (file_exists($file)) {
          $validFiles[] = $file;
        }
      }
    }

    if (count($validFiles) < 1) {
      return false;
    }

    $zip = new ZipArchive();
    $type = $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE;
    if ($zip->open($destination, $type) !== true) {
      return false;
    }

    $dest = str_replace('.zip', '', basename($destination));
    foreach ($validFiles as $file) {
      $zip->addFile($file, $dest . DS . basename($file));
    }
    $zip->close();

    return file_exists($destination);
  }
}

?>
