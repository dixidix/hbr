<?php
require 'bd.php';
$_POST = json_decode(file_get_contents('php://input'), true);

$errors = array();
$resolve_data = array();

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));


switch ($method) {
	case 'PUT':
	if (empty($errors)){
		$data = $_POST;

		if($data['action'] === "edit"){
			editproduct($data);
		}

		if($data['action'] === "delete"){
			deleteproduct($data);
		}

        if($data['action'] === "changeprivileges"){
            changeprivileges($data);
        }
	}
	else{
		print_r($errors);
	}
	break;
	case 'POST':
	if (empty($errors)){
		$data = $_POST;
		if($data['method']=='POST'){
			addproduct($data);
		}
		else if($data['method']=='DELETE'){
			deleteproduct($data);
		}
	}
	else{
		print_r($errors);
	}
	break;
	case 'GET':
	if (empty($errors)){
		$data = $_GET;
		getproducts($data);
	}
	else{
		print_r($errors);
	}
	break;
	
	default:
	print_r($errors);
	break;
}


function addproduct($data){
	$errors = array();
	$resolve_data = array();
	foreach($data as $key=>$value) {
        if(!empty($data[$key])){
            $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data[$key]));
        }
        else {
            $errors[$key] = "error al obtener $key";
        }
	}

	$res = MysqliDB::getInstance()->query("SELECT * FROM products WHERE product_name='" . $product_name . "' AND category_id='" . $category_id . "' AND deleted='0'");
	$rows = mysqli_num_rows($res);

	if ($rows > 0){
		$errors['existingProducts'] = 'El Producto ingresado ya existe en el sistema.';
	}
	if (empty($errors)){
		MysqliDB::getInstance()->query("INSERT INTO `products`( `product_name`, `product_desc`, `imp_rights`, `imp_estadistic_rate`,`imp_iva`, `imp_iva_adic`, `category_id`) VALUES ('".$product_name."','".$product_desc."','".$imp_rights."','".$imp_estadistic_rate."','".$imp_iva."','".$imp_iva_adic."','".$category_id."') ");
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	} else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function editproduct($data){
	$errors = array();
	$resolve_data = array();

	foreach($data as $key=>$value) {
        if(!empty($data[$key])){
            $$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data[$key]));
        }
        else {
            $errors[$key] = "error al obtener $key";
        }
	}

	if (empty($errors)){
		MysqliDB::getInstance()->query("UPDATE `products` SET `product_name`='" .$product_name. "',`product_desc`='" .$product_desc. "',`imp_rights`='" .$imp_rights. "',`imp_estadistic_rate`='" .$imp_estadistic_rate. "',`imp_iva`='" .$imp_iva. "',`imp_iva_adic`='" .$imp_iva_adic. "',`category_id`='" .$category_id. "'  WHERE `id`='" .$id. "'");
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function getproducts($data){
	if(count($data) > 0){
		//f		unciones para traer usuarios
		switch ($data['action']) {
			case 'getAll':
			getAllproducts($data);
			break;
            case 'getByCategoryId':
            getByCategoryId($data);
            break;
			default:
			print_r($errors);
			break;
		}
		
	}
	else{
		getAllproducts($data);
	}
}
function getAllproducts($data){
    $isPremium = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['isPremium']));

    if(!empty($isPremium)){
	    $res = MysqliDB::getInstance()->query("SELECT * FROM `products` JOIN `categories` WHERE categories.category_id = products.category_id AND products.deleted = 0 and products.premium = ". $isPremium ." ORDER BY products.category_id ASC , products.id DESC");
	} else {
	    $res = MysqliDB::getInstance()->query("SELECT * FROM `products` JOIN `categories` WHERE categories.category_id = products.category_id AND products.deleted = 0 ORDER BY products.category_id ASC , products.id DESC");
	}

	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"name":"'  . $rs["product_name"] . '",';
		$outp .= '"description":"'  . $rs["product_desc"] . '",';
		$outp .= '"imp_rights":'  . $rs["imp_rights"] . ',';
		$outp .= '"imp_estadistic_rate":'  . $rs["imp_estadistic_rate"] . ',';
		$outp .= '"isPremium":"'  . $rs["premium"] . '",';
		$outp .= '"category_id":"'  . $rs["category_id"] . '",';
		$outp .= '"category_name":"'  . $rs["category_name"] . '",';
		$outp .= '"imp_iva":'  . $rs["imp_iva"] . ',';
		$outp .= '"imp_iva_adic":'   . $rs["imp_iva_adic"]  . '}';
	}
	$outp ='{"products":['.$outp.']}';

	echo($outp);
}
function getByCategoryId($data){
    $categoryId = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['categoryId']));

	    $res = MysqliDB::getInstance()->query("SELECT * FROM `products` JOIN `categories` WHERE categories.category_id = products.category_id AND products.deleted = 0 and products.category_id = ". $categoryId ." ORDER BY products.category_id ASC , products.id DESC");


	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"name":"'  . $rs["product_name"] . '",';
		$outp .= '"description":"'  . $rs["product_desc"] . '",';
		$outp .= '"imp_rights":'  . $rs["imp_rights"] . ',';
		$outp .= '"imp_estadistic_rate":'  . $rs["imp_estadistic_rate"] . ',';
		$outp .= '"isPremium":"'  . $rs["premium"] . '",';
		$outp .= '"category_id":"'  . $rs["category_id"] . '",';
		$outp .= '"category_name":"'  . $rs["category_name"] . '",';
		$outp .= '"imp_iva":'  . $rs["imp_iva"] . ',';
		$outp .= '"imp_iva_adic":'   . $rs["imp_iva_adic"]  . '}';
	}
	$outp ='{"products":['.$outp.']}';

	echo($outp);
}
function deleteproduct($data){
	$errors = array();
	$resolve_data = array();

	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	echo $id;

	MysqliDB::getInstance()->query("UPDATE `products` SET `deleted` = 1 WHERE id='" .$id. "'");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);

}
function changeprivileges($data){
	$errors = array();
	$resolve_data = array();

	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	$isPremium = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['isPremium']));

	MysqliDB::getInstance()->query("UPDATE `products` SET `premium` = ".$isPremium." WHERE id='" .$id. "'");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);

}
?>