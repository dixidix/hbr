<?php 

require 'bd.php';

$errors = array();
$resolve_data = array();

$bill_id = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bill_id']));
$category_id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['category']));	
$name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));
$price = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['price']));
$quantity = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['quantity']));
$totalprice = (float) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['total_price']));

if(!empty($_POST['total_weight'])){
$totalweight = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['total_weight']));
} else {
   $totalweight = 0.00; 
}
if(!empty($_POST['weight'])){
$weight = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['weight']));
} else {
   $weight = 0.00; 
}

$userId = (int) MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['userId']));


if (empty($errors)){    
    MysqliDB::getInstance()->query("INSERT INTO `products`( `bill_id`, `category_id`, `name`, `price`, `quantity`,`remaining_quantity`, `totalprice`, `totalweight`, `weight`, `real_weight`, `userId`) VALUES (".$bill_id.",".$category_id.",'".$name."',".(float)$price.",".$quantity.",".$quantity.",".(float)$totalprice.",".(float)$totalweight.",".(float)$weight.",".(float)$weight.",".$userId.")");
    MysqliDB::getInstance()->close();

$resolve_data['success'] = true;
echo json_encode($resolve_data);

} else {
    $resolve_data['errors'] = $errors;
    echo json_encode($resolve_data);
}
?>