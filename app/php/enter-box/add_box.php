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
    MysqliDB::getInstance()->query("INSERT INTO `awb_enter_box`(`awb_boxes_id`,`quantity`,`weight`, `value`, `descrip`, `created`,`aditional_unit`,`aditional_value`,`aditional_total`,`box_warehouse_value`) VALUES (".$id.",'".$quantity."', ".(float) $box_weight.",".(float) $box_value.",'".$long_desc."', '".$created."',".(int) $aditional_unit.",".(float) $aditional_value.",".(float) $aditional_total.",".(float) $box_warehouse_value.")");
    MysqliDB::getInstance()->query("UPDATE `awb_boxes` SET `real_remaining`=".(int)$real_remaining.", `status`=1 WHERE `id` = ".(int)$id."");
    $resolve_data['success'] = true;	
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>