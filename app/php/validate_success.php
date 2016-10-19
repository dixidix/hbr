<?php
require 'bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);

$token = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['token']));
$res = MysqliDB::getInstance()->query("SELECT token FROM ventas WHERE token='".$token."' AND deleted='0'");

$rows = mysqli_num_rows($res);	
if ($rows == 1){
	$data['validate'] = true;
	MysqliDB::getInstance()->query("UPDATE `ventas` SET `state`='1'  where `token` = '".$token."'");
	echo json_encode($data);
}else{
	$data['validate'] = false;
	echo json_encode($data);
}
?>