<?php
require 'bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);

$token = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['token']));
$res = MysqliDB::getInstance()->query("SELECT token FROM ventas WHERE token='".$token."' AND deleted='0'");

$rows = mysqli_num_rows($res);	
if ($rows == 1){
	$data['validate'] = true;

	MysqliDB::getInstance()->query("UPDATE `ventas` SET `state`='1'  where `token` = '".$token."'");
	$res2 = MysqliDB::getInstance()->query("SELECT * FROM ventas WHERE token='".$token."' AND deleted='0'");
	$rows2 = mysqli_num_rows($res2);
	if ($rows2 == 1){
		$rss2 = $res2->fetch_array(MYSQLI_ASSOC);
		$data['lote'] = $rss2['id'];
		$data['date'] = $rss2['timestamp'];
		$uid = $rss2['uid'];
		$res3 = MysqliDB::getInstance()->query("SELECT * FROM users WHERE id='".$uid."' AND deleted='0'");
		$rows3 = mysqli_num_rows($res3);
		if ($rows3 == 1){
			$rss3 = $res3->fetch_array(MYSQLI_ASSOC);
			$data['name'] = $rss3['name'];
			$data['lastname'] = $rss3['lastname'];
			$data['email'] = $rss3['email'];
		}
		echo json_encode($data);
	}else{
		$data['validate'] = false;
		echo json_encode($data);
	}
}
?>