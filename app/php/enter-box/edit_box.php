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
    MysqliDB::getInstance()->query("UPDATE `awb_enter_box` SET `quantity`='".$quantity."',`weight`=".(float)$box_weight.",`value`=".(float)$box_value.",`aditional_unit`=".(int)$aditional_unit.", `aditional_value`=".(float)$aditional_value.", `aditional_total`=".(float)$aditional_total.",`box_warehouse_value`=".(float)$box_warehouse_value.", `descrip`='".$long_desc."' WHERE `id` = ".(int)$id."");
    MysqliDB::getInstance()->query("UPDATE `awb_boxes` SET `remaining`='".$remaining."' WHERE `id` = ".(int)$awb_boxes_id."");
	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>