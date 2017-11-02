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
    MysqliDB::getInstance()->query("UPDATE `boxes` SET `bill`='".$bill."', `stock`= ".(int) $box_stock.", `value`= ".(float) $box_value.", `shipping`= ".(float) $box_shipping_value.", `warehouse`= ".(float) $box_warehouse_value." , `weight`= ". $box_weight.", `long_desc`='".$long_desc."', `short_desc`='".$short_desc."', `whId`=".$whId.",`edited`=".$edited.",`status`= ".(int) $status.", `location`= ".(int) $location."   WHERE `id` = ".(int) $id."");

    $resolve_data['success'] = true;	
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>