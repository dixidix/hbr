<?php 
require 'bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `airway_bill` SET `deleted`=1 WHERE airwayId = ".$id."");

	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>