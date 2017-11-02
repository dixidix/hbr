<?php 
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];
$travel_status = $_POST['travel_status'];
$edited = $_POST['edited'];

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `awb_shipping_box` SET `travel_status`=".(int)$travel_status.", `edited`='".$edited."' WHERE `id` = ".(int)$id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>