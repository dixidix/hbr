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
			editUser($data);
		}

		if($data['action'] === "delete"){
			deleteUser($data);
		}
		if($data['action'] === "changeRoles"){
			changePrivileges($data);
		}
		if($data['action'] === "tutorialChange"){
			tutorialChange($data);
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
			addUser($data);
		}
		else if($data['method']=='DELETE'){
			deleteUser($data);
		}
	}
	else{
		print_r($errors);
	}
	break;
	case 'GET':
	if (empty($errors)){
		$data = $_GET;
		getUsers($data);
	}
	else{
		print_r($errors);
	}
	break;
	
	default:
	print_r($errors);
	break;
}

// AGREGAR UN USUARIO
function adduser($data){
	if(count($data) > 0){
		switch ($data['action']) {
			case 'register':
			register($data);
			break;
			case 'logout':
			logout($data);
			break;
			default:
			print_r($errors);
			break;
		}
	}
}

//EDITAR UN USUARIO
function editUser($data){
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

	if(!empty($data['password']) && !empty($data['password2'])){
		if($password !== $password2){
			$errors['passwordError'] = 'Las contraseñas no coinciden.';
		}
		else {
			$password = md5(stripslashes($password));
		}
	}
	if(!empty($oldEmail) && ($oldEmail !== $email)){
		$res = MysqliDB::getInstance()->query("SELECT * FROM users WHERE email='" . $email . "' AND deleted='0'");

		$rows = mysqli_num_rows($res);
		if ($rows > 0){
			$errors['existingEmail'] = 'El E-Mail ingresado ya existe en el sistema.';
		}
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

		if(!empty($data['password']) && !empty($data['password2'])){
				MysqliDB::getInstance()->query("UPDATE `users` SET `name`='" .$aux_name. "',`lastname`='" .$aux_lastname. "',`tel`='" .$tel. "',`cel`='" .$cel. "',`email`='" .$email. "',`password`='" .$password. "', `codeType`='" .$codeType. "',`idCode`='" .$idCode. "',`address`='" .$address. "',`localidad`='" .$localidad. "',`postalcode`='" .$postalcode. "'  WHERE id='" .$id. "'");
		} else {
			MysqliDB::getInstance()->query("UPDATE `users` SET `name`='" .$aux_name. "',`lastname`='" .$aux_lastname. "',`tel`='" .$tel. "',`cel`='" .$cel. "',`email`='" .$email. "', `codeType`='" .$codeType. "',`idCode`='" .$idCode. "',`address`='" .$address. "',`localidad`='" .$localidad. "',`postalcode`='" .$postalcode. "'  WHERE id='" .$id. "'");	
		}

		MysqliDB::getInstance()->close();
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}

//TRAER UN USUARIO O TODOS
function getUsers($data){
	if(count($data) > 0){
		//f		unciones para traer usuarios
		switch ($data['action']) {
			case 'login':
			login($data);
			break;
			case 'getUserById':
			getUserById($data);
			break;
			case 'getUserBySskey':
			getUserBySskey($data);
			break;
			case 'getAll':
			getAllUsers($data);
			break;
			default:
			print_r($errors);
			break;
		}
		
	}
	else{
		getAllUsers($data);
	}
}

//ELIMINAR UN USUARIO
function deleteUser($data){
	$errors = array();
	$resolve_data = array();

	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	echo $id;

	MysqliDB::getInstance()->query("UPDATE `users` SET `deleted` = 1 WHERE id='" .$id. "'");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
}

function changePrivileges($data){
	$errors = array();
	$resolve_data = array();

	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	$role = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['isAdmin']));

	MysqliDB::getInstance()->query("UPDATE `users` SET `isAdmin` = " .$role. " WHERE id='" .$id. "' ");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
}

function tutorialChange($data){
	$errors = array();
	$resolve_data = array();
	$id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	MysqliDB::getInstance()->query("UPDATE `users` SET `showTutorial` = 1 WHERE id='" .$id. "' ");
	MysqliDB::getInstance()->close();
	echo json_encode($resolve_data);
}

//LOGIN
function login($data){
	$errors = array();
	$resolve_data = array();
	$username = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['username']));
	$password = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['password']));
	
	$sskey = md5(uniqid(rand(), true));
	
	$username = stripslashes($username);
	$password = md5(stripslashes($password));

	$res = MysqliDB::getInstance()->query("SELECT id,name,lastname,company_name, warehouse_name, isAdmin, client_type, lang FROM users WHERE email='" . $username . "' AND password='" . $password . "' AND deleted='0'");
	
	$rows = mysqli_num_rows($res);

	if ($rows == 1){
		$rss = $res->fetch_array(MYSQLI_ASSOC);
		
		$id = $rss['id'];
		if(!empty($rss['name'])){
			$resolve_data['name'] = $rss['name'];
		}
		if(!empty($rss['company_name'])){
			$resolve_data['name'] = $rss['company_name'];
			$resolve_data['company_name'] = $rss['company_name'];
		}
		if(!empty($rss['warehouse_name'])){
			$resolve_data['name'] = $rss['warehouse_name'];
			$resolve_data['warehouse_name'] = $rss['warehouse_name'];
		}
		$resolve_data['lastname'] = $rss['lastname'];
		$resolve_data['isAdmin'] = $rss['isAdmin'];
		$resolve_data['client_type'] = $rss['client_type'];
		$resolve_data['uid'] = $rss['id'];
		$resolve_data['lang'] = $rss['lang'];
		
		MysqliDB::getInstance()->query("UPDATE `users` SET `sskey`='".$sskey."' WHERE `id`='$id'");
		$resolve_data['sskey'] = $sskey;
		
		echo json_encode($resolve_data);
		
	}
	else{
		$errors['loginError'] = 'Los datos ingresados no son correctos.';
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
	
	MysqliDB::getInstance()->close();
}
function getAllUsers($data){
	$client_type = $data['client_type'];
	$res = MysqliDB::getInstance()->query("SELECT * from users WHERE client_type = '" . $client_type . "' and deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		if(!empty($rs["name"])){
			$outp .= '"name":"'  . $rs["name"] . '",';
		}
		if(!empty($rs["lastname"])){
			$outp .= '"lastname":"'  . $rs["lastname"] . '",';
		}
		if(!empty($rs["company_name"])){
			$outp .= '"company_name":"'  . $rs["company_name"] . '",';
		}
		if(!empty($rs["company_real_name"])){
			$outp .= '"company_real_name":"'  . $rs["company_real_name"] . '",';
		}
		$outp .= '"tel":"'  . $rs["tel"] . '",';
		$outp .= '"cel":"'  . $rs["cel"] . '",';
		$outp .= '"email":"'  . $rs["email"] . '",';
		$outp .= '"codeType": '  . $rs["codeType"] . ',';
		$outp .= '"idCode":"'  . $rs["idCode"] . '",';
		$outp .= '"address":"'  . $rs["address"] . '",';
		$outp .= '"localidad":"'  . $rs["localidad"] . '",';
		$outp .= '"postalcode":"'  . $rs["postalcode"] . '",';
		$outp .= '"isPremium":"'  . $rs["isPremium"] . '",';
		$outp .= '"isAdmin":"'   . $rs["isAdmin"]  . '"}';
	}
	$outp ='{"users":['.$outp.']}';

	echo($outp);
}
//Traer un determinado usuario por ID
function getUserById($data){
	$errors = array();
	$resolve_data = array();
	$uid = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	$res = MysqliDB::getInstance()->query("SELECT * FROM users WHERE id='" . $uid . "' AND deleted='0'");
	
	$rows = mysqli_num_rows($res);
	
	if ($rows == 1){
		$rss = $res->fetch_array(MYSQLI_ASSOC);
		
		$resolve_data['id'] = $rss['id'];
		if(!empty($rss["name"])){
			$resolve_data['name'] = $rss['name'];
		}
		if(!empty($rss["lastname"])){
			$resolve_data['lastname'] = $rss['lastname'];
		}
		if(!empty($rss["company_name"])){
			$resolve_data['company_name'] = $rss['company_name'];
		}
		if(!empty($rss["company_real_name"])){
			$resolve_data['company_real_name'] = $rss['company_real_name'];
		}
		if(!empty($rss["warehouse_name"])){
			$resolve_data['warehouse_name'] = $rss['warehouse_name'];
		}
		$resolve_data['tel'] = $rss['tel'];
		$resolve_data['cel'] = $rss['cel'];
		$resolve_data['email'] = $rss['email'];
		$resolve_data['codeType'] = $rss['codeType'];
		$resolve_data['idCode'] = $rss['idCode'];
		$resolve_data['address'] = $rss['address'];
		$resolve_data['localidad'] = $rss['localidad'];
		$resolve_data['postalcode'] = $rss['postalcode'];
		$resolve_data['isPremium'] = $rss['isPremium'];

		echo json_encode($resolve_data);
	}
	else{
		$errors['getUserError'] = 'No se encontro usuario relacionado a esa sesion.';
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
	
	MysqliDB::getInstance()->close();
}

//Traer datos de usuario segun la key de sesion
function getUserBySskey($data){
	$errors = array();
	$resolve_data = array();
	$sskey = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['sskey']));

	$res = MysqliDB::getInstance()->query("SELECT * FROM users WHERE sskey='" . $sskey . "' AND deleted='0'");
	
	$rows = mysqli_num_rows($res);
	
	if ($rows == 1){
		$rss = $res->fetch_array(MYSQLI_ASSOC);
		
		$resolve_data['id'] = $rss['id'];
		$resolve_data['name'] = $rss['name'];
		$resolve_data['lastname'] = $rss['lastname'];
		$resolve_data['tel'] = $rss['tel'];
		$resolve_data['cel'] = $rss['cel'];
		$resolve_data['email'] = $rss['email'];
		$resolve_data['codeType'] = $rss['codeType'];
		$resolve_data['idCode'] = $rss['idCode'];
		$resolve_data['address'] = $rss['address'];
		$resolve_data['localidad'] = $rss['localidad'];
		$resolve_data['postalcode'] = $rss['postalcode'];
		$resolve_data['isPremium'] = $rss['isPremium'];

		echo json_encode($resolve_data);
	}
	else{
		$errors['getUserError'] = 'No se encontro usuario relacionado a esa sesion.';
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
	
	MysqliDB::getInstance()->close();
}
// LOG OUT
function logout($data){
	$errors = array();
	$resolve_data = array();
	$sskey = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['sskey']));
	
	if (empty($errors)){
		MysqliDB::getInstance()->query("UPDATE `users` SET `sskey`= NULL WHERE `sskey` = '".$sskey."'");
		MysqliDB::getInstance()->close();
		$data['deleted'] = true;
		echo json_encode($data);
	}
	else{
		print_r($errors);
	}
}


//REGISTER
function register($data){
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
			VALUES ('".$aux_name."','".$aux_lastname."','".$aux_company_name."','".$aux_company_real_name."','".$aux_warehouse_name."','".$tel."','".$cel."','".$email."','".$password."','".$codeType."','".$idCode."',0,'".$address."','".$localidad."','".$postalCode."','".$registerToken."',".$timestamp.",".$client_type.")");
		
		MysqliDB::getInstance()->close();
		$resolve_data['registerToken'] = $registerToken;
		echo json_encode($resolve_data);
	}
	else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}
}
?>