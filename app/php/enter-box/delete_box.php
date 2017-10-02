<?php 
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];
$remaining = $_POST['remaining'];
$awb_boxes_id = $_POST['awb_boxes_id'];

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `awb_enter_box` SET `deleted`=1 WHERE id = ".$id."");
    MysqliDB::getInstance()->query("UPDATE `awb_boxes` SET `remaining`=".(int)$remaining." WHERE `id` = ".(int)$awb_boxes_id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>