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
		editPurchase($data);
	}
	else{
		print_r($errors);
	}
	break;
	case 'POST':
	if (empty($errors)){
		$data = $_POST;
		if($data['method']=='POST'){
			addPurchase($data);
		}
		else if($data['method']=='DELETE'){
			deletePurchase($data);
		}
	}
	else{
		print_r($errors);
	}
	break;
	case 'GET':
	if (empty($errors)){
		$data = $_GET;
		getPurchase($data);
	}
	else{
		print_r($errors);
	}
	break;
	
	default:
	print_r($errors);
	break;
}

//EDITAR UN USUARIO
function editPurchase($data){
	echo 'edit one: '.$data['data'];
}

//TRAER UN USUARIO O TODOS
function getPurchase($data){
	if(count($data) > 0){
		//f		unciones para traer usuarios
		switch ($data['action']) {
			case 'getById':
			getById($data);
			break;
			case 'getAll':
			getAll();
			break;
			default:
			print_r($errors);
			break;
		}		
	}
}
function getAll(){

$res = MysqliDB::getInstance()->query("SELECT * from ventas WHERE deleted = 0");
$outp="";
while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
	$outpm ="";
	if ($outp != "") {$outp .= ",";}

	$outp .= '{"id":"'  . $rs["id"] . '",';
	$outp .= '"uid":"'  . $rs["uid"] . '",';
	$outp .= '"peso_excedente":"'  . $rs["peso_excedente"] . '",';
	$outp .= '"parcial_price":"'  . $rs["parcial_price"] . '",';
	$outp .= '"peso_total":"'  . $rs["peso_total"] . '",';
	$outp .= '"tasas":"'  . $rs["tasas"] . '",';
	$outp .= '"total": '  . $rs["total"] . ',';
	$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
	$outp .= '"transporte":"'  . $rs["transporte"] . '",';
	$outp .= '"state":"'  . $rs["state"] . '",';
	$outp .= '"paymentGatewayUrl":"'  . $rs["todopago"] . '",';

	$uname = MysqliDB::getInstance()->query("SELECT * FROM producto WHERE venta_id=" . $rs["id"]);
	while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
		if ($outpm != "") {$outpm .= ",";}
		$outpm .= '{"id":'   . $rss["product_id"].',';
		$outpm .= '"productType":"'  . $rss["productType"] . '",';
		$outpm .= '"quantity":'  . $rss["quantity"] . ',';
		$outpm .= '"partial_price":'  . $rss["partial_price"] . ',';
		$outpm .= '"price":'  . $rss["price"] . ',';
		$outpm .= '"partial_weight":'  . $rss["partial_weight"] . ',';
		$outpm .= '"weight":'  . $rss["weight"] . ',';
		$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
		$outpm .= '"postal":"'  . $rss["postal"] . '",';
		$outpm .= '"bill_number":"'  . $rss["bill_number"] . '",';
		$outpm .= '"tracking_number":"'   . $rss["tracking_number"].'"}';
	}

	$outp .='"products":['.$outpm.'],';
	$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
}
$outp ='{"ventas":['.$outp.']}';

echo($outp);

}
function addPurchase($data){
	$errors = array();
	$resolve_data = array();
	$purchase = array();

	$peso_excedente = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['peso_excedente']));
	$parcial_price = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['parcial_price']));
	$peso_total = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['peso_total']));
	$tasas = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['tasas']));
	$total = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['total']));
	$total_quantity = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['total_quantity']));
	$transporte = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['transporte']));
	$uid = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['userId']));
	$products = $data['products'];

	if (empty($errors)){
		$timestamp = round(microtime(true) * 1000);
		MysqliDB::getInstance()->query("INSERT INTO `ventas`(`uid`, `peso_excedente`, `parcial_price`, `peso_total`, `tasas`, `total`, `total_quantity`, `transporte`) VALUES ('".$uid."',".$peso_excedente.",".$parcial_price.",".$peso_total.",".$tasas.",".$total.",".$total_quantity.",".$transporte.")");

		$res = MysqliDB::getInstance()->query("SELECT MAX(id) as id FROM `ventas`");		
		$rows = mysqli_num_rows($res);

		if ($rows > 0){
			$rss = $res->fetch_array(MYSQLI_ASSOC);
			$venta_id = $rss['id'];

		}
	} else {
		$resolve_data['errors'] = $errors;
		echo json_encode($resolve_data);
	}

	foreach ( $products as $key => $value) {

		$productType = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($value['productType']));
		$tracking_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($value['tracking_number']));
		$establishment = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($value['establishment']));
		$postal = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($value['postal']));
		$bill_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($value['bill_number']));
		$quantity = $value['quantity'];
		$price = $value['price'];		
		$weight = $value['weight'];

		$partial_price = $price / $quantity;
		$partial_weight = $weight / $quantity;

		MysqliDB::getInstance()->query("INSERT INTO `producto`(`venta_id`, `productType`, `quantity`, `partial_price`, `price`, `partial_weight`, `weight`, `establishment`, `postal`, `tracking_number`, `bill_number`) VALUES (".$venta_id.",'".$productType."',".$quantity.",".$partial_price.",".$price.",".$partial_weight.",".$weight.",'".$establishment."','".$postal."','".$tracking_number."','".$bill_number."')");

	}
	MysqliDB::getInstance()->close();
	$resolve_data['success'] = true;
	echo json_encode($resolve_data);
}
//ELIMINAR UN USUARIO
function deletePurchase($data){
	echo 'delete one: '. $data['data'];
}
?>