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
	$errors = array();
	$resolve_data = array();
	$v_id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['id']));
	$paymentGatewayUrl = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['paymentGatewayUrl']));
	$token = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['token']));
	echo "UPDATE `ventas` SET `token`='".$token."' where `id` = '".$v_id."'";
	MysqliDB::getInstance()->query("UPDATE `ventas` SET `token`='".$token."' where `id` = '".$v_id."'");
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
		$outp .= '"total_remaining_quantity":"'  . $rs["total_remaining_quantity"] . '",';
		$outp .= '"transporte":"'  . $rs["transporte"] . '",';
		$outp .= '"state":"'  . $rs["state"] . '",';
		$outp .= '"paymentButton":"'  . $rs["paymentButton"] . '",';
		$uname = MysqliDB::getInstance()->query("SELECT * FROM producto INNER JOIN categories ON producto.category_id = categories.category_id where producto.venta_id =" . $rs["id"]);
		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"id":'   . $rss["product_id"].',';
			$outpm .= '"category_id":"'  . $rss["category_id"] . '",';
			$outpm .= '"category_name":"'  . $rss["category_name"] . '",';
			$outpm .= '"product_name":"'  . $rss["product_name"] . '",';
			$outpm .= '"description":"'  . $rss["product_desc"] . '",';
			$outpm .= '"quantity":'  . $rss["quantity"] . ',';
			$outpm .= '"partial_price":'  . $rss["partial_price"] . ',';
			$outpm .= '"price":'  . $rss["price"] . ',';
			$outpm .= '"partial_weight":'  . $rss["partial_weight"] . ',';
			$outpm .= '"weight":'  . $rss["weight"] . ',';
			$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
			$outpm .= '"postal":"'  . $rss["postal"] . '",';
			$outpm .= '"bill_number":"'  . $rss["bill_number"] . '",';
			$outpm .= '"bill_name":"'  . $rss["bill_name"] . '",';
			$outpm .= '"bill_file":"'  . $rss["bill_file"] . '",';
			$outpm .= '"tracking_number":"'   . $rss["tracking_number"].'"}';
		}

		$outp .='"products":['.$outpm.'],';
		$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
	}
	$outp ='{"ventas":['.$outp.']}';
}
function addPurchase($data){
	$errors = array();
	$resolve_data = array();
	$purchase = array();

	$parcial_price = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['parcial_price']));
	$total_weight = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['total_weight']));	
	$total = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['total']));
	$total_quantity = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['total_quantity']));
	$uid = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['userId']));
	$timestamp = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['timestamp']));
	$state = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($data['state']));
	// $products = $data['products'];

		if (empty($errors)){
			if(empty($_POST['id'])){ 
					MysqliDB::getInstance()->query("INSERT INTO `ventas`(`uid`, `parcial_price`, `total`, `total_quantity`,`total_remaining_quantity`, `timestamp`,  `totalweight`, `guide_amount`,`state`) VALUES ('".$uid."',".(float)$parcial_price.",".(float)$total.",".(float)$total_quantity.",".(int)$total_quantity.",".$timestamp.",".$total_weight.", '0',".$state.")");
					$res = MysqliDB::getInstance()->query("SELECT MAX(id) as id FROM `ventas`");		
				

				$res = MysqliDB::getInstance()->query("SELECT MAX(id) as id FROM `ventas`");		
				$rows = mysqli_num_rows($res);

				if ($rows > 0){
					$rss = $res->fetch_array(MYSQLI_ASSOC);
					$venta_id = $rss['id'];
				}
				
			}else{
			$venta_id = $_POST['id'];
			MysqliDB::getInstance()->query("UPDATE `ventas` SET `parcial_price`=".(float)$parcial_price.",`total`=".(float)$total.",`total_quantity`=".(int)$total_quantity.",`total_remaining_quantity`=".(int)$total_quantity.",`timestamp`=".$timestamp.", `totalweight`=".(float)$total_weight.",`guide_amount`= 0,`state`=".(int)$state." WHERE `id` = ".$_POST['id']."");
			}
		} else {
			$resolve_data['errors'] = $errors;
			echo json_encode($resolve_data);
		}

		$res3 = MysqliDB::getInstance()->query("SELECT * FROM users WHERE id='".$uid."' AND deleted='0'");
		$rows3 = mysqli_num_rows($res3);
		if ($rows3 == 1){
			$rss3 = $res3->fetch_array(MYSQLI_ASSOC);
			$resolve_data['name'] = $rss3['name'];
			$resolve_data['lastname'] = $rss3['lastname'];
			$resolve_data['email'] = $rss3['email'];
			$resolve_data['lote'] = $venta_id;
			$resolve_data['date'] = $timestamp;
			$resolve_data['ventaId'] = $venta_id;
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