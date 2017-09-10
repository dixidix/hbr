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
    MysqliDB::getInstance()->query("INSERT INTO `awb_boxes`(`uid`,`tracking`,`provider`, `stock`, `value`, `weight`, `whId`, `created`) VALUES (".$uid.",'".$tracking."','".$provider."', ".(int) $stock.", ".(float) $box_value.",  ". (float) $weight.",".$whId.", '".$created."')");
    $res = MysqliDB::getInstance()->query("SELECT MAX(id) as id FROM `awb_boxes`");		
    $rows = mysqli_num_rows($res);

    if ($rows > 0){
        $rss = $res->fetch_array(MYSQLI_ASSOC);
        $resolve_data['boxId'] = $rss['id'];	

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