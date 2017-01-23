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

    $check = MysqliDB::getInstance()->query("SELECT * FROM `airway_bill_product` WHERE airwayId=".$airwayId." AND product_id=".$product_id." AND deleted=0");		
    $rows = mysqli_num_rows($check);

    if ($rows == 0){
    MysqliDB::getInstance()->query("INSERT INTO `airway_bill_product`(`airwayId`, `product_id`, `category_id`, `name`, `price`, `quantity`, `total_price`, `real_weight`, `total_weight`, `userId`) VALUES (".$airwayId.",".$product_id.",".$category_id.",'".$name."',".(float)$price.",".(int)$quantity.",".(float)$total_price.",".(float)$real_weight.",".(float)$total_weight.",".$userId.")");

	$resolve_data['success'] = true;	
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
    } else {
        MysqliDB::getInstance()->query("UPDATE `airway_bill_product` SET `quantity`= ".(int)$quantity.",`total_price`=".(float)$total_price.",`real_weight`=".(float)$real_weight.", `total_weight`=".(float)$total_weight." WHERE awb_productId = ".$awb_productId." and deleted = 0");
        $resolve_data['success'] = true;	
        MysqliDB::getInstance()->close();
        echo json_encode($resolve_data);
    }
} else {
    $resolve_data['errors'] = $errors;
	MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
}

?>