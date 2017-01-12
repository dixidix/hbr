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
			editcategory($data);
		}

		if($data['action'] === "delete"){
			deletecategory($data);
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
			addcategory($data);
		}
		else if($data['method']=='DELETE'){
			deletecategory($data);
		}
	}
	else{
		print_r($errors);
	}
	break;
	case 'GET':
	if (empty($errors)){
		$data = $_GET;
		getcategories($data);
	}
	else{
		print_r($errors);
	}
	break;
	
	default:
	print_r($errors);
	break;
}


function addcategory($data){
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

	$res = MysqliDB::getInstance()->query("SELECT * FROM categories WHERE category_name='" . $category_name . "' AND deleted='0'");
	$rows = mysqli_num_rows($res);

	if ($rows > 0){
		$errors['existingCategory'] = 'La categoría ingresada ya existe en el sistema.';
	}
	if (empty($errors)){

		MysqliDB::getInstance()->query("INSERT INTO `categories`( `category_name`) VALUES ('".$category_name."')");
		
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function editcategory($data){
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

	$res = MysqliDB::getInstance()->query("SELECT * FROM categories WHERE category_name='" . $category_name . "' AND deleted='0'");
	$rows = mysqli_num_rows($res);

	if ($rows > 0){
		$errors['existingCategory'] = 'La categoría ingresada ya existe en el sistema.';
	}
	if (empty($errors)){

		MysqliDB::getInstance()->query("UPDATE `categories` SET `category_name`='" .$category_name. "'  WHERE category_id='" .$category_id. "'");
		
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function getcategories($data){
	if(count($data) > 0){
		//f		unciones para traer usuarios
		switch ($data['action']) {
			case 'getAll':
			getAllcategories($data);
			break;
			default:
			print_r($errors);
			break;
		}
		
	}
	else{
		getAllcategories($data);
	}
}
function getAllcategories($data){
	$res = MysqliDB::getInstance()->query("SELECT * from categories WHERE  deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"category_id":"'  . $rs["category_id"] . '",';

		$ress = MysqliDB::getInstance()->query("SELECT COUNT(*) as amount from products WHERE category_id=".$rs['category_id']." and deleted = 0");
		while($rss = $ress->fetch_array(MYSQLI_ASSOC)) {
		$outp .= '"product_amount":"'  . $rss["amount"] . '",';
		}
		$outp .= '"name":"'   . $rs["category_name"]  . '"}';
	}
	$outp ='{"categories":['.$outp.']}';

	echo($outp);
}

function deletecategory($data){
	$errors = array();
	$resolve_data = array();

	$category_id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['category_id']));
	echo $id;

	MysqliDB::getInstance()->query("UPDATE `categories` SET `deleted` = 1 WHERE category_id='" .$category_id. "'");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);

}
?>