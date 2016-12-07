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
			editWarehouse($data);
		}

		if($data['action'] === "delete"){
			deleteWarehouse($data);
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
			addWarehouse($data);
		}
		else if($data['method']=='DELETE'){
			deleteWarehouse($data);
		}
	}
	else{
		print_r($errors);
	}
	break;
	case 'GET':
	if (empty($errors)){
		$data = $_GET;
		getWarehouses($data);
	}
	else{
		print_r($errors);
	}
	break;
	
	default:
	print_r($errors);
	break;
}


function addWarehouse($data){
	$errors = array();
	$resolve_data = array();
	foreach($data as $key=>$value) {		
		if($key !== "tel" && $key !== "cel"){
			if(!empty($data[$key])){				
				$$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data[$key]));
			}
			else {
				$errors[$key] = "error al obtener $key";
			}
		}
	}

	$res = MysqliDB::getInstance()->query("SELECT * FROM users WHERE email='" . $email . "' AND deleted='0'");
	$registerToken = md5(uniqid(rand(), true));
	$rows = mysqli_num_rows($res);
	
	if (empty($data['tel']) && empty($data['cel'])){
		$errors['telError'] = 'Debe indicar al menos un número de contacto.';
	}
	else {
		if(!empty($data['tel'])){
			$tel = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['tel']));
		}
		else {
			$tel = null;
		}
		if(!empty($data['cel'])){
			$cel = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['cel']));
		}
		else {
			$cel = null;
		}
	}
	if($password !== $password2){
		$errors['passwordError'] = 'Las contraseñas no coinciden.';
	}
	else {
		$password = md5(stripslashes($password));
	}
	if ($rows > 0){
		$errors['existingEmail'] = 'El E-Mail ingresado ya existe en el sistema.';
	}
	if (empty($errors)){
		$timestamp = time();

		$aux_name = !empty($data['name']) ? $data['name'] : '';
		$aux_lastname = !empty($data['lastname']) ? $data['lastname'] : '';
		$aux_company_name = !empty($data['company_name']) ? $data['company_name'] : '';
		$aux_company_real_name = !empty($data['company_real_name']) ? $data['company_real_name'] : '';
		$aux_warehouse_name = !empty($data['warehouse_name']) ? $data['warehouse_name'] : '';

		if($aux_name && $aux_lastname){
			$client_type = 0;
		}
		if($aux_company_name && $aux_company_real_name){
			$client_type = 1;
		}

		MysqliDB::getInstance()->query("INSERT INTO `users`( `name`, `lastname`, `company_name`, `company_real_name`,`warehouse_name`, `tel`, `cel`, `email`, `password`, `codeType`, `idCode`,`deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`, `client_type`)
			VALUES ('".$aux_name."','".$aux_lastname."','".$aux_company_name."','".$aux_company_real_name."','".$aux_warehouse_name."','".$tel."','".$cel."','".$email."','".$password."','".$codeType."','".$idCode."',0,'".$address."','".$localidad."','".$postalcode."','".$registerToken."',".$timestamp.",".$client_type.")");
		
		MysqliDB::getInstance()->close();
		$resolve_data['registerToken'] = $registerToken;
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function editWarehouse($data){
	$errors = array();
	$resolve_data = array();
	foreach($data as $key=>$value) {		
		if($key !== "tel" && $key !== "cel"){
			if(!empty($data[$key])){				
				$$key = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data[$key]));
			}
			else {
				$errors[$key] = "error al obtener $key";
			}
		}
	}

	
	if (empty($data['tel']) && empty($data['cel'])){
		$errors['telError'] = 'Debe indicar al menos un número de contacto.';
	}
	else {
		if(!empty($data['tel'])){
			$tel = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['tel']));
		}
		else {
			$tel = null;
		}
		if(!empty($data['cel'])){
			$cel = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['cel']));
		}
		else {
			$cel = null;
		}
	}
	if($password !== $password2){
		$errors['passwordError'] = 'Las contraseñas no coinciden.';
	}
	else {
		$password = md5(stripslashes($password));
	}
	if (empty($errors)){
		$timestamp = time();

		$aux_name = !empty($data['name']) ? $data['name'] : '';
		$aux_lastname = !empty($data['lastname']) ? $data['lastname'] : '';
		$aux_company_name = !empty($data['company_name']) ? $data['company_name'] : '';
		$aux_company_real_name = !empty($data['company_real_name']) ? $data['company_real_name'] : '';
		$aux_warehouse_name = !empty($data['warehouse_name']) ? $data['warehouse_name'] : '';

		if($aux_name && $aux_lastname){
			$client_type = 0;
		}
		if($aux_company_name && $aux_company_real_name){
			$client_type = 1;
		}

		MysqliDB::getInstance()->query("UPDATE `users` SET `warehouse_name`='" .$aux_warehouse_name. "',`tel`='" .$tel. "',`cel`='" .$cel. "',`email`='" .$email. "',`password`='" .$password. "', `codeType`='" .$codeType. "',`idCode`='" .$idCode. "',`address`='" .$address. "',`localidad`='" .$localidad. "',`postalcode`='" .$postalcode. "'  WHERE id='" .$id. "'");
		
		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

function getWarehouses($data){
	if(count($data) > 0){
		//f		unciones para traer usuarios
		switch ($data['action']) {
			case 'getAll':
			getAllWarehouses($data);
			break;
			default:
			print_r($errors);
			break;
		}
		
	}
	else{
		getAllWarehouses($data);
	}
}
function getAllWarehouses($data){
	$res = MysqliDB::getInstance()->query("SELECT * from users WHERE client_type = '2' and deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		if(!empty($rs["warehouse_name"])){
			$outp .= '"name":"'  . $rs["warehouse_name"] . '",';
		}
		$outp .= '"tel":"'  . $rs["tel"] . '",';
		$outp .= '"cel":"'  . $rs["cel"] . '",';
		$outp .= '"email":"'  . $rs["email"] . '",';
		$outp .= '"codeType": '  . $rs["codeType"] . ',';
		$outp .= '"idCode":"'  . $rs["idCode"] . '",';
		$outp .= '"address":"'  . $rs["address"] . '",';
		$outp .= '"localidad":"'  . $rs["localidad"] . '",';
		$outp .= '"postalcode":"'   . $rs["postalcode"]  . '"}';
	}
	$outp ='{"warehouses":['.$outp.']}';

	echo($outp);
}

function deleteWarehouse($data){
	$errors = array();
	$resolve_data = array();

	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	echo $id;

	MysqliDB::getInstance()->query("UPDATE `users` SET `deleted` = 1 WHERE id='" .$id. "'");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);

}
?>