<?php 
require 'bd.php';

$errors = array();
$resolve_data = array();

foreach($_POST as $key=>$value) {		
    if(!empty($_POST[$key])){				
        $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST[$key]));
    }
    else {
        $$key = null;
    }    
}

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `airway_bill` SET `quantity`=".(int)$quantity.",`number`=".(int)$number.",`weight`=".(float)$weight.",`price`=".(float)$price." WHERE `airwayId` = ".$airwayId." AND deleted = 0");

	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>