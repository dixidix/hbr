<?php
require 'bd.php';

$action = $_GET['action'];

if(!empty($_GET['data'])){
    $data = $_GET['data'];
}
switch ($action) {
    case 'getAll': getAll();
        break;
    case 'getByBatchId': getByBatchId($data);
        break;
    case 'getByUserId': getByUserId();
        break;
	case 'getByWhId': getByWhId();
        break;
    default: print_r($errors);
        break;
}

function getAll(){
$res = MysqliDB::getInstance()->query("SELECT * from ventas WHERE deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		$outpuser = "";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"uid":"'  . $rs["uid"] . '",';
        $outp .= '"parcial_price":"'  . (float) $rs["parcial_price"] . '",';
		$outp .= '"total_weight":"'  . $rs["totalweight"] . '",';
		$outp .= '"total": '  . $rs["total"] . ',';
		$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
		$outp .= '"total_remaining_quantity":"'  . $rs["total_remaining_quantity"] . '",';
		$outp .= '"venta_state":"'  . $rs["venta_state"] . '",';
		$outp .= '"status":"'  . $rs["status"] . '",';
		$outp .= '"readed":"'  . (int) $rs["readed"] . '",';
		$outp .= '"reason":"'  . $rs["reason"] . '",';
		$outp .= '"guide_amount":"'  . $rs["guide_amount"] . '",';
		$uname = MysqliDB::getInstance()->query("SELECT * FROM bills where ventaId =" . $rs["id"]);

		$user = MysqliDB::getInstance()->query("SELECT * FROM users  where  id =".$rs["uid"]." AND deleted = 0");
		while($rsuser = $user->fetch_array(MYSQLI_ASSOC)) {				
			if ($outpuser != "") {$outpuser .= ",";}
			$outpuser .= '{"name":"'   . $rsuser["name"].'",';
			$outpuser .= '"lastname":"'  . $rsuser["lastname"] . '",';
			$outpuser .= '"company_real_name":"'  . $rsuser["company_real_name"] . '",';
			$outpuser .= '"warehouse_name":"'  . $rsuser["warehouse_name"] . '",';
			$outpuser .= '"tel":"'  . $rsuser["tel"] . '",';
			$outpuser .= '"cel":"'  . $rsuser["cel"] . '",';
			$outpuser .= '"email":"'  . $rsuser["email"] . '",';
			$outpuser .= '"codeType":"'  . $rsuser["codeType"] . '",';
			$outpuser .= '"idCode":"'  . $rsuser["idCode"] . '",';
			$outpuser .= '"address":"'  . $rsuser["address"] . '",';
			$outpuser .= '"localidad":"'  . $rsuser["localidad"] . '",';
			$outpuser .= '"postalcode":"'  . $rsuser["postalcode"] . '",';
			$outpuser .= '"isAdmin":"'  . $rsuser["isAdmin"] . '",';
			$outpuser .= '"isPremium":"'  . $rsuser["isPremium"] . '",';
			$outpuser .= '"client_type":"'  . $rsuser["client_type"] . '",';
			$outpuser .= '"company_name":"'   . $rsuser["company_name"].'"}';
		}

		$outp .='"user":['.$outpuser.'],';

		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			$outpwh = "";
			
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"bill_id":"'   . $rss["bill_id"].'",';
			$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
			$outpm .= '"whId":"'  . $rss["whId"] . '",';
			$outpm .= '"bill_state":"'  . $rss["bill_state"] . '",';

			$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . $rss["whId"] . " and deleted = 0");
			while($rswh = $wh->fetch_array(MYSQLI_ASSOC)) {
				if ($outpwh != "") {$outpwh .= ",";}
				$outpwh .= '{"id":"'  . $rswh["id"] . '",';
				if(!empty($rswh["warehouse_name"])){
					$outpwh .= '"name":"'  . $rswh["warehouse_name"] . '",';
				}
				$outpwh .= '"tel":"'  . $rswh["tel"] . '",';
				$outpwh .= '"cel":"'  . $rswh["cel"] . '",';
				$outpwh .= '"email":"'  . $rswh["email"] . '",';
				$outpwh .= '"codeType": '  . $rswh["codeType"] . ',';
				$outpwh .= '"idCode":"'  . $rswh["idCode"] . '",';
				$outpwh .= '"address":"'  . $rswh["address"] . '",';
				$outpwh .= '"localidad":"'  . $rswh["localidad"] . '",';
				$outpwh .= '"postalcode":"'   . $rswh["postalcode"]  . '"}';
			}

			$outpm .='"warehouse":['.$outpwh.'],';

			$outpm .= '"number":"'  . $rss["number"] . '",';
			$outpm .= '"provider":"'  . $rss["provider"] . '",';
			$outpm .= '"quantity":"'  . $rss["quantity"] . '",';
			$outpm .= '"remaining_quantity":"'  . $rss["remaining_quantity"] . '",';
			$outpm .= '"timestamp":"'  . $rss["timestamp"] . '",';
			$outpm .= '"total_price":"'  . $rss["totalprice"] . '",';
			$outpm .= '"total_weight":"'  . $rss["totalweight"] . '",';
			$outpm .= '"tracking_number":"'  . $rss["trackingnumber"] . '",';
			$uname2 =  MysqliDB::getInstance()->query("SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id where products.bill_id =" . $rss["bill_id"]." and products.deleted = 0");
			while($rsss = $uname2->fetch_array(MYSQLI_ASSOC)) {
				if ($outpmn != "") {$outpmn .= ",";}
				$outpmn .= '{"product_id":"'   . $rsss["product_id"].'",';
				$outpmn .= '"category_id":"'  . $rsss["category_id"] . '",';
				$outpmn .= '"category_name":"'  . $rsss["category_name"] . '",';
				$outpmn .= '"name":"'  . $rsss["name"] . '",';
				$outpmn .= '"price":"'  . $rsss["price"] . '",';
				$outpmn .= '"quantity":"'  . $rsss["quantity"] . '",';
				$outpmn .= '"remaining_quantity":"'  . $rsss["remaining_quantity"] . '",';
				$outpmn .= '"total_price":"'  . $rsss["totalprice"] . '",';
				$outpmn .= '"total_weight":"'  . $rsss["totalweight"] . '",';
				$outpmn .= '"weight":"'  . $rsss["weight"] . '",';
				$outpmn .= '"real_weight":"'  . $rsss["real_weight"] . '",';
				$outpmn .= '"userId":"'   . $rsss["userId"].'"}';
			}

			$outpm .='"products":['.$outpmn.'],';

			$outpm .= '"userId":"'  . $rss["userId"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
			$outpm .= '"wh_enter_date":"'  . $rss["wh_enter_date"] . '",';
			$outpm .= '"bill_file_path":"'   . $rss["bill_file_path"].'"}';
		}

		$outp .='"bills":['.$outpm.'],';
		$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
	}
	$outp ='{"ventas":['.$outp.']}';

	echo($outp);
}

function getByBatchId ($data) {

}

function getByUserId () {
$res = MysqliDB::getInstance()->query("SELECT * from ventas WHERE deleted = 0 AND uid=" . $_GET["id"]);
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"uid":"'  . $rs["uid"] . '",';
        $outp .= '"parcial_price":"'  . (float) $rs["parcial_price"] . '",';
		$outp .= '"total_weight":"'  . $rs["totalweight"] . '",';
		$outp .= '"total": '  . $rs["total"] . ',';
		$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
		$outp .= '"total_remaining_quantity":"'  . $rs["total_remaining_quantity"] . '",';
		$outp .= '"venta_state":"'  . $rs["venta_state"] . '",';
		$outp .= '"status":"'  . $rs["status"] . '",';
		$outp .= '"reason":"'  . $rs["reason"] . '",';
		$outp .= '"guide_amount":"'  . $rs["guide_amount"] . '",';
		$uname = MysqliDB::getInstance()->query("SELECT * FROM bills where ventaId =" . $rs["id"]);

		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			$outpwh = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"bill_id":"'   . $rss["bill_id"].'",';
			$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
			$outpm .= '"whId":"'  . $rss["whId"] . '",';
			$outpm .= '"bill_state":"'  . $rss["bill_state"] . '",';
			
			$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . $rss["whId"] . " and deleted = 0");
			while($rswh = $wh->fetch_array(MYSQLI_ASSOC)) {
				if ($outpwh != "") {$outpwh .= ",";}
				$outpwh .= '{"id":"'  . $rswh["id"] . '",';
				if(!empty($rswh["warehouse_name"])){
					$outpwh .= '"name":"'  . $rswh["warehouse_name"] . '",';
				}
				$outpwh .= '"tel":"'  . $rswh["tel"] . '",';
				$outpwh .= '"cel":"'  . $rswh["cel"] . '",';
				$outpwh .= '"email":"'  . $rswh["email"] . '",';
				$outpwh .= '"codeType": '  . $rswh["codeType"] . ',';
				$outpwh .= '"idCode":"'  . $rswh["idCode"] . '",';
				$outpwh .= '"address":"'  . $rswh["address"] . '",';
				$outpwh .= '"localidad":"'  . $rswh["localidad"] . '",';
				$outpwh .= '"postalcode":"'   . $rswh["postalcode"]  . '"}';
			}

			$outpm .='"warehouse":['.$outpwh.'],';
		
			$outpm .= '"number":"'  . $rss["number"] . '",';
			$outpm .= '"provider":"'  . $rss["provider"] . '",';
			$outpm .= '"quantity":"'  . $rss["quantity"] . '",';
			$outpm .= '"remaining_quantity":"'  . $rss["remaining_quantity"] . '",';
			$outpm .= '"timestamp":"'  . $rss["timestamp"] . '",';
			$outpm .= '"total_price":"'  . $rss["totalprice"] . '",';
			$outpm .= '"total_weight":"'  . $rss["totalweight"] . '",';
			$outpm .= '"tracking_number":"'  . $rss["trackingnumber"] . '",';
			$uname2 =  MysqliDB::getInstance()->query("SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id where products.bill_id =" . $rss["bill_id"]." and products.deleted = 0");
			while($rsss = $uname2->fetch_array(MYSQLI_ASSOC)) {
				if ($outpmn != "") {$outpmn .= ",";}
				$outpmn .= '{"product_id":"'   . $rsss["product_id"].'",';
				$outpmn .= '"category_id":"'  . $rsss["category_id"] . '",';
				$outpmn .= '"category_name":"'  . $rsss["category_name"] . '",';
				$outpmn .= '"name":"'  . $rsss["name"] . '",';
				$outpmn .= '"price":"'  . $rsss["price"] . '",';
				$outpmn .= '"quantity":"'  . $rsss["quantity"] . '",';
				$outpmn .= '"remaining_quantity":"'  . $rsss["remaining_quantity"] . '",';
				$outpmn .= '"total_price":"'  . $rsss["totalprice"] . '",';
				$outpmn .= '"total_weight":"'  . $rsss["totalweight"] . '",';
				$outpmn .= '"weight":"'  . $rsss["weight"] . '",';
				$outpmn .= '"real_weight":"'  . $rsss["real_weight"] . '",';
				$outpmn .= '"userId":"'   . $rsss["userId"].'"}';
			}

			$outpm .='"products":['.$outpmn.'],';

			$outpm .= '"userId":"'  . $rss["userId"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
			$outpm .= '"wh_enter_date":"'  . $rss["wh_enter_date"] . '",';
			$outpm .= '"bill_file_path":"'   . $rss["bill_file_path"].'"}';
		}

		$outp .='"bills":['.$outpm.'],';
		$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
	}
	$outp ='{"ventas":['.$outp.']}';

	echo($outp);
}

function getByWhId(){
	$res = MysqliDB::getInstance()->query("SELECT * from ventas WHERE deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		$outpuser = "";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"uid":"'  . $rs["uid"] . '",';
		$outp .= '"venta_state":"'  . $rs["venta_state"] . '",';
        $outp .= '"parcial_price":"'  . (float) $rs["parcial_price"] . '",';
		$outp .= '"total_weight":"'  . $rs["totalweight"] . '",';
		$outp .= '"total": '  . $rs["total"] . ',';
		$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
		$outp .= '"status":"'  . $rs["status"] . '",';
		$outp .= '"reason":"'  . $rs["reason"] . '",';
		$outp .= '"total_remaining_quantity":"'  . $rs["total_remaining_quantity"] . '",';
		$outp .= '"guide_amount":"'  . $rs["guide_amount"] . '",';

		$user = MysqliDB::getInstance()->query("SELECT * FROM users  where  id =".$rs["uid"]." AND deleted = 0");
		while($rsuser = $user->fetch_array(MYSQLI_ASSOC)) {				
			if ($outpuser != "") {$outpuser .= ",";}
			$outpuser .= '{"name":"'   . $rsuser["name"].'",';
			$outpuser .= '"lastname":"'  . $rsuser["lastname"] . '",';
			$outpuser .= '"company_real_name":"'  . $rsuser["company_real_name"] . '",';
			$outpuser .= '"warehouse_name":"'  . $rsuser["warehouse_name"] . '",';
			$outpuser .= '"tel":"'  . $rsuser["tel"] . '",';
			$outpuser .= '"cel":"'  . $rsuser["cel"] . '",';
			$outpuser .= '"email":"'  . $rsuser["email"] . '",';
			$outpuser .= '"codeType":"'  . $rsuser["codeType"] . '",';
			$outpuser .= '"idCode":"'  . $rsuser["idCode"] . '",';
			$outpuser .= '"address":"'  . $rsuser["address"] . '",';
			$outpuser .= '"localidad":"'  . $rsuser["localidad"] . '",';
			$outpuser .= '"postalcode":"'  . $rsuser["postalcode"] . '",';
			$outpuser .= '"isAdmin":"'  . $rsuser["isAdmin"] . '",';
			$outpuser .= '"isPremium":"'  . $rsuser["isPremium"] . '",';
			$outpuser .= '"client_type":"'  . $rsuser["client_type"] . '",';
			$outpuser .= '"company_name":"'   . $rsuser["company_name"].'"}';
		}

		$outp .='"user":['.$outpuser.'],';

		$uname = MysqliDB::getInstance()->query("SELECT * FROM bills where ventaId =" . $rs["id"]." and deleted= 0  and whId = ".$_GET['whId']);

		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			$outpwh = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"bill_id":"'   . $rss["bill_id"].'",';
			$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
			$outpm .= '"whId":"'  . $rss["whId"] . '",';

			$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . $rss["whId"] . " and deleted = 0");
			while($rswh = $wh->fetch_array(MYSQLI_ASSOC)) {
				if ($outpwh != "") {$outpwh .= ",";}
				$outpwh .= '{"id":"'  . $rswh["id"] . '",';
				if(!empty($rswh["warehouse_name"])){
					$outpwh .= '"name":"'  . $rswh["warehouse_name"] . '",';
				}
				$outpwh .= '"tel":"'  . $rswh["tel"] . '",';
				$outpwh .= '"cel":"'  . $rswh["cel"] . '",';
				$outpwh .= '"email":"'  . $rswh["email"] . '",';
				$outpwh .= '"codeType": '  . $rswh["codeType"] . ',';
				$outpwh .= '"idCode":"'  . $rswh["idCode"] . '",';
				$outpwh .= '"address":"'  . $rswh["address"] . '",';
				$outpwh .= '"localidad":"'  . $rswh["localidad"] . '",';
				$outpwh .= '"postalcode":"'   . $rswh["postalcode"]  . '"}';
			}

			$outpm .='"warehouse":['.$outpwh.'],';
		
			$outpm .= '"number":"'  . $rss["number"] . '",';
			$outpm .= '"provider":"'  . $rss["provider"] . '",';
			$outpm .= '"quantity":"'  . $rss["quantity"] . '",';
			$outpm .= '"remaining_quantity":"'  . $rss["remaining_quantity"] . '",';
			$outpm .= '"timestamp":"'  . $rss["timestamp"] . '",';
			$outpm .= '"total_price":"'  . $rss["totalprice"] . '",';
			$outpm .= '"total_weight":"'  . $rss["totalweight"] . '",';
			$outpm .= '"tracking_number":"'  . $rss["trackingnumber"] . '",';
			$uname2 =  MysqliDB::getInstance()->query("SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id where products.bill_id =" . $rss["bill_id"]." and products.deleted = 0");
			while($rsss = $uname2->fetch_array(MYSQLI_ASSOC)) {
				if ($outpmn != "") {$outpmn .= ",";}
				$outpmn .= '{"product_id":"'   . $rsss["product_id"].'",';
				$outpmn .= '"category_id":"'  . $rsss["category_id"] . '",';
				$outpmn .= '"category_name":"'  . $rsss["category_name"] . '",';
				$outpmn .= '"name":"'  . $rsss["name"] . '",';
				$outpmn .= '"price":"'  . $rsss["price"] . '",';
				$outpmn .= '"quantity":"'  . $rsss["quantity"] . '",';
				$outpmn .= '"remaining_quantity":"'  . $rsss["remaining_quantity"] . '",';
				$outpmn .= '"total_price":"'  . $rsss["totalprice"] . '",';
				$outpmn .= '"total_weight":"'  . $rsss["totalweight"] . '",';
				$outpmn .= '"weight":"'  . $rsss["weight"] . '",';
				$outpmn .= '"real_weight":"'  . $rsss["real_weight"] . '",';
				$outpmn .= '"userId":"'   . $rsss["userId"].'"}';
			}

			$outpm .='"products":['.$outpmn.'],';

			$outpm .= '"userId":"'  . $rss["userId"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
			$outpm .= '"wh_enter_date":"'  . $rss["wh_enter_date"] . '",';
			$outpm .= '"bill_file_path":"'   . $rss["bill_file_path"].'"}';
		}

		$outp .='"bills":['.$outpm.'],';
		$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
	}
	$outp ='{"ventas":['.$outp.']}';

	echo($outp);
}
?>