<?php 
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];
$awb_id = $_POST['awb_id'];

if (empty($errors)){
	MysqliDB::getInstance()->query("UPDATE `awb_enter_box` SET `status`=1 WHERE id = ".$id."");
	MysqliDB::getInstance()->query("UPDATE `awb_boxes` SET `status`=2 WHERE `id` = ".(int)$awb_id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>