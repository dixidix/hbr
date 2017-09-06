<?php 
require './../bd.php';

$errors = array();
$resolve_data = array();

$uid = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['uid']));
$boxId = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['boxId']));
$timestamp = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['timestamp']));
$number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['number']));
$stock = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['stock']));
$value = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['value']));
$weight = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['weight']));
$long_desc = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['long_desc']));

$file_name_bill = "";
$path_bill = "";
 
	if(!empty($_FILES['bill_file'])){
		$file_name_bill = $_FILES['bill_file']['name'];
		$file_name_bill = str_replace(' ', '_', $file_name_bill);
		$file_size_bill =$_FILES['bill_file']['size'];
		$file_tmp_bill = $_FILES['bill_file']['tmp_name'];
		$file_type_bill =$_FILES['bill_file']['type'];
		$file_ext_bill = strtolower(pathinfo($file_name_bill, PATHINFO_EXTENSION));
		$fileSystemname_bill = $file_name_bill . $timestamp;
		$fileSystemname_bill = hash('sha256', $fileSystemname_bill);
		$fileSystemname_bill = "$fileSystemname_bill.$file_ext_bill";
		$tmp_path_bill = "../files/".$timestamp."/".$fileSystemname_bill;
		$path_bill = "/dist/files/".$timestamp."/".$fileSystemname_bill;
	}

	if(!file_exists("../files/".$timestamp."/")){
		mkdir("../files/".$timestamp."/");
		if(!empty($_FILES['bill_file'])){
			move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
		}
	} else {
		if(!empty($_FILES['bill_file'])){
			move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
		}
	}

	if (empty($errors)){
		MysqliDB::getInstance()->query("INSERT INTO `awb_box_bills`(`uid`,`boxId`, `timestamp`, `number`, `stock`, `value`,`weight`, `long_desc`, `bill_file_name`, `bill_file_path`) VALUES (".$uid.",".$boxId.",'".$timestamp."','".$number."',".$stock.",".$value.",".$weight.",'".$long_desc."','".$file_name_bill."','".$path_bill."')");

		$resolve_data['success'] = true;	
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	} else {
		$resolve_data['errors'] = $errors;
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
?>