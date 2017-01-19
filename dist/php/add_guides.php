<?php 
require 'bd.php';

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

if (empty($errors)){
    MysqliDB::getInstance()->query("INSERT INTO `airway_bill`(`ventaId`,`number`, `quantity`, `weight`, `price`) VALUES (".$ventaId.",".$number.", ".$quantity.", ".$weight.", ".$price.")");

    $res = MysqliDB::getInstance()->query("SELECT MAX(airwayId) as id FROM `airway_bill`");		
    $rows = mysqli_num_rows($res);

    if ($rows > 0){
        $rss = $res->fetch_array(MYSQLI_ASSOC);
        $resolve_data['airwayId'] = $rss['id'];

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