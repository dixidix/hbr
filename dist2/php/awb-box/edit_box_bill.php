<?php 
require './../bd.php';

$errors = array();
$resolve_data = array();

$uid = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['uid']));
$id = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['id']));
$timestamp = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['timestamp']));
$number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['number']));
$stock = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['stock']));
$value = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['value']));
$weight = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['weight']));
$long_desc = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['long_desc']));
$file_name_bill = !empty($_POST['bill_file_name']) ? $_POST['bill_file_name'] : null;
$path_bill = !empty($_POST['bill_file_path']) ? $_POST['bill_file_path'] : null;

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
		$tmp_path_bill = "./../../files/".$timestamp."/".$fileSystemname_bill;
		$path_bill = "/dist/files/".$timestamp."/".$fileSystemname_bill;
	} 

	if(!file_exists("./../../files/".$timestamp."/")){
		mkdir("./../../files/".$timestamp."/");
		if(!empty($_FILES['bill_file'])){
			move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
		}
	} else {
		if(!empty($_FILES['bill_file'])){
			move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
		}
	}


if (empty($errors)){
	if(empty($file_name_bill) && empty($path_bill)){
		$file_name_bill = null;
		$path_bill = null;
	}
	MysqliDB::getInstance()->query("UPDATE `awb_box_bills` SET `number`='".$number."',`stock`='".(int)$stock."',`value`=". (float) $value.",`weight`=".(float)$weight.",`long_desc`='".$long_desc."',`bill_file_name`='".$file_name_bill."',`bill_file_path`='".$path_bill."' WHERE `id` = ".(int)$id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>