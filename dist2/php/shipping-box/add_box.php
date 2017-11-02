<?php
require './../bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);

$errors = array();
$resolve_data = array();

foreach($_POST as $key=>$value) {		
    if(!empty($_POST[$key])){				
        $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST[$key]));
    }
    else {
        $$key = null;
    }    
}

if(empty($errors)){
    MysqliDB::getInstance()->query("INSERT INTO `awb_shipping_box`(`created`, `wh_location`,`status`,`uid`) VALUES (".$created.", ". (int) $wh_location.", ".(int) $status.", ".(int) $uid.")");

    $res = MysqliDB::getInstance()->query("SELECT MAX(id) as id FROM `awb_shipping_box`");		
    $rows = mysqli_num_rows($res);

    if ($rows > 0){
        $rss = $res->fetch_array(MYSQLI_ASSOC);
        $resolve_data['id'] = $rss['id'];	

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