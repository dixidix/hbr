<?php 
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$resolve_data = array();

$id = $_POST['id'];
$warehouse_location = $_POST['warehouse_location'];
$travel_status = $_POST['travel_status'];

$wh_arrival_date = $_POST['wh_arrival_date'];
$wh_leave_date = $_POST['wh_leave_date'];
$wh_provider = $_POST['wh_provider'];
$wh_tracking = $_POST['wh_tracking'];

$edited = $_POST['edited'];

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `awb_shipping_box` SET `wh_location`=".(int) $warehouse_location.", `edited`='".$edited."',`travel_status`='".$travel_status."', `wh_tracking`='".$wh_tracking."', `wh_provider`='".$wh_provider."', `wh_arrival_date`='".$wh_arrival_date."', `wh_leave_date`='".$wh_leave_date."' WHERE `id` = ".(int)$id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>