<?php 
require 'bd.php';

$errors = array();
$resolve_data = array();

$ventaId = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
$whId = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['whId']));
$establishment = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['establishment']));	
$number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['number']));
$provider = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['provider']));
$quantity = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['quantity']));
$remaining_quantity = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['quantity']));
$timestamp = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['timestamp']));
$totalprice = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['total_price']));
$totalweight = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['total_weight']));
$trackingnumber = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['tracking_number']));
$userId = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['userId']));

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
	if(!empty($_FILES['bill'])){
		move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
	}
} else {
	if(!empty($_FILES['bill'])){
		move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
	}
}

if (empty($errors)){
    MysqliDB::getInstance()->query("INSERT INTO `bills`(`ventaId`,`whId`, `establishment`, `number`, `provider`, `quantity`,`remaining_quantity`, `timestamp`, `totalprice`, `totalweight`, `trackingnumber`, `userId`, `bill_file_name`, `bill_file_path`) VALUES (".$ventaId.",".$whId.",'".$establishment."','".$number."','".$provider."',".$quantity.",".$remaining_quantity.",'".$timestamp."',".$totalprice.",".$totalweight.",'".$trackingnumber."',".$userId.",'".$file_name_bill."','".$path_bill."')");

    $res = MysqliDB::getInstance()->query("SELECT MAX(bill_id) as id FROM `bills`");		
    $rows = mysqli_num_rows($res);

    if ($rows > 0){
        $rss = $res->fetch_array(MYSQLI_ASSOC);
        $resolve_data['bill_id'] = $rss['id'];	

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