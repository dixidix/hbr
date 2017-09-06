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
    MysqliDB::getInstance()->query("INSERT INTO `boxes`(`uid`,`bill`,`stock`, `value`, `weight`, `long_desc`, `short_desc`, `whId`, `created`) VALUES (".$uid.",'".$bill."',".$box_stock.", ".$box_value.", ".$box_weight.", '".$long_desc."', '".$short_desc."', ".$whId.", '".$created."')");
    $resolve_data['success'] = true;	
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
} else {
    $resolve_data['errors'] = $errors;
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>