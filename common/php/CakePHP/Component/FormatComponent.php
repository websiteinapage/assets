<?php
App::uses('Component', 'Controller');
class FormatComponent extends Component {
    //put your code here
    function preview($info) {
        // preview 75 characters
        return substr($info, 0, 75) . (strlen($info)>75?"...":"");
    }
    
    function valueOrBlank( $value ) {
        if(empty($value)):
            return "";
        else:
            return $value;
        endif;
    }
}

?>
