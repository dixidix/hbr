<?php 
require 'bd.php';

$errors = array();
$resolve_data = array();

foreach($_POST as $key=>$value) {		
    if(!empty($_POST[$key])){				
        $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST[$key]));
    }
    else {
        $$key = NULL;
    }    
}

if (empty($errors)){

    MysqliDB::getInstance()->query("UPDATE `airway_bill` SET `quantity`=".(int)$quantity.", `state`=".(int)$state.",`number`=".(int)$number.",`weight`=".(float)$weight.",`price`=".(float)$price.", `warehouse_enter`=".(float)$warehouse_enter.", `warehouse_aditional_weight`=".(float)$warehouse_aditional_weight.",`warehouse_aditional_charges`=".(float)$warehouse_aditional_charges.",`warehouse_total`=".(float)$warehouse_total.",`shipment_international`=".(float)$shipment_international.",`shipment_total`=".(float)$shipment_total.",`arrivalDate`='".$arrivalDate."',`paymentGatewayUrl`='".$paymentGatewayUrl."',`token`='".$token."',`successUrl`='".$successUrl."',`hbr_tracking`='".$hbr_tracking."',`hbr_postal_provider`='".$hbr_postal_provider."',`billing_total`=".(float)$billing_total." WHERE `airwayId` = ".$airwayId." AND deleted = 0");

	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>