<?php
require 'bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$data = array();
if (!empty($_POST['sskey'])) {
	$sskey = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['sskey']));
	$res = MysqliDB::getInstance()->query("SELECT sskey,isAdmin FROM users WHERE sskey='".$sskey."' AND deleted='0'");

	$rows = mysqli_num_rows($res);
	
	if ($rows == 1){
		$rss = $res->fetch_array(MYSQLI_ASSOC);
		$data['isLogged'] = true;
		$data['isAdmin'] = $rss['isAdmin'];
		echo json_encode($data);

	}else{
		$data['isLogged'] = false;
		echo json_encode($data);
	}

} else {
	$data['isLogged'] = false;
	echo json_encode($data);
}
MysqliDB::getInstance()->close();
?>