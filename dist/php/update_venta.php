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
    echo "UPDATE `ventas` SET `total_remaining_quantity`=".$total_remaining_quantity."  WHERE `id`= ".$id."";
    MysqliDB::getInstance()->query("UPDATE `ventas` SET `total_remaining_quantity`=".$total_remaining_quantity."  WHERE `id`= ".$id."");

	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>