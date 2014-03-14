<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BraintreeComponent
 *
 * @author uchilaka
 */
$DIR = str_replace(DS . 'CakePHP' . DS . 'Component', '', __DIR__);

// import braintree component class
require_once($DIR . DS . 'braintree' . DS . 'braintree_php' . DS . 'lib'. DS . 'Braintree.php');

class BraintreeComponent extends Component {
    
    const MERCHANT_ID = 'mdk3rwkczthvxyym';
    const PUBLIC_KEY = 'svcgq63hw952sjdf';
    const PRIVATE_KEY = 'a453c3575ecfce69e6525682b96f3c5c';
    const CLIENT_SIDE_TOKEN = 'MIIBCgKCAQEApMOa+XK8yYhnGgyuCMYPdW2vmLVQSobKhw1OES/U62x1uKPEgSyc2TZtLRdZRuvhEX33dNjQX/GAKu/PYDA9s3ysAyfLMHVFe1lKtFRfEDEdNv4dkEf85Zv04Pukyoi+c6PDrqYfuJA6iaE8eXK6fQIRvyNHATG+KsHEO0Tqc99SD0hkVod6eLdpadNe07CP61ypdlp97u1ElywCMyvJb4uPiPpeE9FWVC1ZsX3gRAeubWJ70JUeTrQAiE2hCsxLJXF2fuOIUa1aU+P8/9Tsf0FJ/GjnIM/LoZBv+T8POb04xzIkzBazoIXqivrztqqP89ID849I1tosBzrHv3TUqQIDAQAB';
   
    function initialize(Controller $controller) {
        parent::initialize($controller);
        
        Braintree_Configuration::environment('sandbox');
        Braintree_Configuration::merchantId(self::MERCHANT_ID);
        Braintree_Configuration::publicKey(self::PUBLIC_KEY);
        Braintree_Configuration::privateKey(self::PRIVATE_KEY);        
        
        // Production Settings
        /*
        Braintree_Configuration::environment('sandbox');
        Braintree_Configuration::merchantId('mdk3rwkczthvxyym');
        Braintree_Configuration::publicKey('svcgq63hw952sjdf');
        Braintree_Configuration::privateKey('a453c3575ecfce69e6525682b96f3c5c');
         */
    }
    
    function parseAddress( $addy, $customer ) {
        return array(
            'user_id'=>$addy->customerId,
            'address_id'=>$addy->id,
            'merchant_id'=>$customer->merchantId,
            'unique_address_identifier'=>null,
            'first_name'=>$addy->firstName,
            'last_name'=>$addy->lastName,
            'company'=>$addy->company,
            'street_address'=>$addy->streetAddress,
            'extended_address'=>$addy->extendedAddress,
            'locality'=>$addy->locality,
            'region'=>$addy->region,
            'postal_code'=>$addy->postalCode,
            'country_code_alpha_2'=>$addy->countryCodeAlpha2,
            'created'=>$addy->createdAt->format("Y-m-d H:i:s"),
            'modified'=>$addy->updatedAt->format("Y-m-d H:i:s")
        );
        
    }
    
    function parseCreditCard( $card, $customer ) {
        return array(
            'user_id'=>$customer->id,
            'token'=>$card->token,
            'merchant_id'=>$customer->merchantId,
            'address_id'=>$card->billingAddress->id,
            'unique_card_identifier'=>$card->uniqueNumberIdentifier,
            'cardholder_name'=>$card->cardholderName,
            'card_type'=>$card->cardType,
            'masked_number'=>$card->maskedNumber,
            'expiration_date'=>$card->expirationDate,
            'is_default'=>$card->isDefault(),
            'created'=>$card->createdAt->format("Y-m-d H:i:s")
        );
    }
    
}

