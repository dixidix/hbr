<?php 
require 'bd.php';

$errors = array();
$resolve_data = array();

foreach($_POST as $key=>$value) {		
    if(!empty($_POST[$key])){				
        $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST[$key]));
    }
    else {
        $$key = NULL;
    }    
}

if (empty($errors)){

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
if(!empty($_FILES['bill_file'])){
    MysqliDB::getInstance()->query("UPDATE `bills` SET `whId`=".(int)$whId.",`establishment`='".$establishment."',`number`='".$number."',`provider`='".$provider."',`quantity`=".(int)$quantity.",`remaining_quantity`=".(int)$quantity.",`timestamp`=".(int)$timestamp.",`totalprice`=".(float)$total_price.",`totalweight`=".(float)$total_weight.",`trackingnumber`='".$tracking_number."',`bill_file_name`='".$bill_file_name."',`bill_file_path`='".$bill_file_path."' WHERE `bill_id`= ".(int)$bill_id."");
} else {
        MysqliDB::getInstance()->query("UPDATE `bills` SET `whId`=".(int)$whId.",`establishment`='".$establishment."',`number`='".$number."',`provider`='".$provider."',`quantity`=".(int)$quantity.",`remaining_quantity`=".(int)$quantity.",`timestamp`=".(int)$timestamp.",`totalprice`=".(float)$total_price.",`totalweight`=".(float)$total_weight.",`trackingnumber`='".$tracking_number."' WHERE `bill_id`= ".(int)$bill_id."");
}
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>