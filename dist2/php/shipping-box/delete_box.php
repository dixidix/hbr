<?php 
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];
$edited = $_POST['edited'];
if (empty($errors)){
	MysqliDB::getInstance()->query("UPDATE `awb_shipping_box` SET `deleted`= 1, `edited`='".$edited."' WHERE `id` = ".(int)$id."");
	MysqliDB::getInstance()->query("UPDATE `awb_enter_box` SET `shipping_box_id`= NULL  WHERE `shipping_box_id` = ".(int)$id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>