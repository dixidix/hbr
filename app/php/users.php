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
		editUser($data);
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
	echo 'edit one: '.$data['data'];
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
	echo 'delete one: '. $data['data'];
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
	
	$res = MysqliDB::getInstance()->query("SELECT id,name,lastname,isAdmin FROM users WHERE email='" . $username . "' AND password='" . $password . "' AND deleted='0'");
	
	$rows = mysqli_num_rows($res);
	
	if ($rows == 1){
		$rss = $res->fetch_array(MYSQLI_ASSOC);
		
		$id = $rss['id'];
		$resolve_data['name'] = $rss['name'];
		$resolve_data['lastname'] = $rss['lastname'];
		$resolve_data['isAdmin'] = $rss['isAdmin'];
		
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
$res = MysqliDB::getInstance()->query("SELECT * from users WHERE deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"name":"'  . $rs["name"] . '",';
		$outp .= '"lastname":"'  . $rs["lastname"] . '",';
		$outp .= '"tel":"'  . $rs["tel"] . '",';
		$outp .= '"cel":"'  . $rs["cel"] . '",';
		$outp .= '"email":"'  . $rs["email"] . '",';
		$outp .= '"codeType": '  . $rs["codeType"] . ',';
		$outp .= '"idCode":"'  . $rs["idCode"] . '",';
		$outp .= '"address":"'  . $rs["address"] . '",';
		$outp .= '"localidad":"'  . $rs["localidad"] . '",';
		$outp .= '"postalcode":"'  . $rs["postalcode"] . '",';
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

		echo json_encode($resolve_data);
	}else{
		$errors['getUserError'] = 'No se encontro usuario.';
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
		MysqliDB::getInstance()->query("INSERT INTO `users`( `name`, `lastname`, `tel`, `cel`, `email`, `password`, `codeType`, `idCode`,`deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`)
			VALUES ('".$name."','".$lastname."','".$tel."','".$cel."','".$email."','".$password."','".$codeType."','".$idCode."',0,'".$address."','".$localidad."','".$postalCode."','".$registerToken."',".$timestamp.")");
		
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