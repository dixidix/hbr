<?php

require 'bd.php';

$errors = array();
$resolve_data = array();

$productType = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['productType']));
$tracking_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['tracking_number']));
$establishment = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['establishment']));
$postal = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['postal']));
$bill_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bill_number']));
$venta_id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
$timestamp =   MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['timestamp']));

$quantity = $_POST['quantity'];
$price = $_POST['price'];		
$weight = $_POST['weight'];

$partial_price = $price / $quantity;
$partial_weight = $weight / $quantity;

if(!empty($_FILES['bill'])){
	$file_name_bill = $_FILES['bill']['name'];
	$file_name_bill = str_replace(' ', '_', $file_name_bill);
	$file_size_bill =$_FILES['bill']['size'];
	$file_tmp_bill = $_FILES['bill']['tmp_name'];
	$file_type_bill =$_FILES['bill']['type'];
	$file_ext_bill = strtolower(pathinfo($file_name_bill, PATHINFO_EXTENSION));
	$fileSystemname_bill = $file_name_bill . $timestamp;
	$fileSystemname_bill = hash('sha256', $fileSystemname_bill);
	$fileSystemname_bill = "$fileSystemname_bill.$file_ext_bill";
	$tmp_path_bill = "../files/".$timestamp."/".$fileSystemname_bill;
	$path_bill = "/dist/files/".$timestamp."/".$fileSystemname_bill;
}

if(!file_exists("../files/".$timestamp."/")){
	mkdir("../files/".$timestamp."/");
	if(!empty($_FILES['bill'])){
		move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
	}
} else {
	if(!empty($_FILES['bill'])){
		move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
	}
}

if(!$errors){
	MysqliDB::getInstance()->query("INSERT INTO `producto`(`venta_id`, `productType`, `quantity`, `partial_price`, `price`, `partial_weight`, `weight`, `establishment`, `postal`, `tracking_number`, `bill_number`, `bill_name`, `bill_file`) VALUES (".$venta_id.",'".$productType."',".$quantity.",".$partial_price.",".$price.",".$partial_weight.",".$weight.",'".$establishment."','".$postal."','".$tracking_number."','".$bill_number."','".$file_name_bill."','".$path_bill."')");

	MysqliDB::getInstance()->close();
	$resolve_data['success'] = true;
	echo json_encode($resolve_data);
}

?>