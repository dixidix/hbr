<?php 
require 'bd.php';

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

    if(!empty($product_id)){
        MysqliDB::getInstance()->query("UPDATE `products` SET `category_id`=".(int)$categoryId.",`name`='".$name."',`price`=".(float)$price.",`quantity`=".(int)$quantity.",`remaining_quantity`=".(int)$quantity.",`totalprice`=".(float)$total_price.",`totalweight`=".(float)$total_weight.",`weight`=".(float)$weight.",`real_weight`=".(float)$weight." WHERE `product_id` = ".(int)$product_id."");
    } else {
        MysqliDB::getInstance()->query("INSERT INTO `products`( `bill_id`, `category_id`, `name`, `price`, `quantity`,`remaining_quantity`, `totalprice`, `totalweight`, `weight`, `real_weight`, `userId`) VALUES (".$bill_id.",".$categoryId.",'".$name."',".(float)$price.",".$quantity.",".$quantity.",".(float)$total_price.",".(float)$total_weight.",".(float)$weight.",".(float)$weight.",".$userId.")");
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