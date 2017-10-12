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
        $$key = NULL;
    }    
}

if (empty($errors)){
    MysqliDB::getInstance()->query("UPDATE `awb_boxes` SET `real_box_value`=". (float) $real_box_value.", `real_box_stock`=". (int) $real_box_stock.", `real_box_weight`=". (float) $real_box_weight.", `real_remaining`=". (int) $real_remaining." WHERE `id` = ".(int)$id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>