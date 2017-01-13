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
    case 'getByUserId': getByUserId($data);
        break;
    default: print_r($errors);
        break;
}

function getAll(){
$res = MysqliDB::getInstance()->query("SELECT * from ventas WHERE deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"uid":"'  . $rs["uid"] . '",';
        $outp .= '"parcial_price":"'  . (float) $rs["parcial_price"] . '",';
		$outp .= '"total_weight":"'  . $rs["total_weight"] . '",';
		$outp .= '"total": '  . $rs["total"] . ',';
		$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
		$outp .= '"state":"'  . $rs["state"] . '",';
		$outp .= '"paymentGatewayUrl":"'  . $rs["paymentGatewayUrl"] . '",';
		$outp .= '"guide_amount":"'  . $rs["guide_amount"] . '",';
		$uname = MysqliDB::getInstance()->query("SELECT * FROM bills where ventaId =" . $rs["id"]);

		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"bill_id":"'   . $rss["bill_id"].'",';
			$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
			$outpm .= '"number":"'  . $rss["number"] . '",';
			$outpm .= '"provider":"'  . $rss["provider"] . '",';
			$outpm .= '"quantity":"'  . $rss["quantity"] . '",';
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
				$outpmn .= '"total_price":"'  . $rsss["totalprice"] . '",';
				$outpmn .= '"total_weight":"'  . $rsss["totalweight"] . '",';
				$outpmn .= '"weight":"'  . $rsss["weight"] . '",';
				$outpmn .= '"userId":"'   . $rsss["userId"].'"}';
			}

			$outpm .='"products":['.$outpmn.'],';

			$outpm .= '"userId":"'  . $rss["userId"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
			$outpm .= '"bill_file_path":"'   . $rss["bill_file_path"].'"}';
		}

		$outp .='"bills":['.$outpm.'],';
		//$uname = MysqliDB::getInstance()->query("SELECT * FROM producto INNER JOIN categories ON producto.category_id = categories.category_id where producto.venta_id =" . $rs["id"]);
		// while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
		// 	if ($outpm != "") {$outpm .= ",";}
		// 	$outpm .= '{"id":'   . $rss["product_id"].',';
		// 	$outpm .= '"category_id":"'  . $rss["category_id"] . '",';
		// 	$outpm .= '"category_name":"'  . $rss["category_name"] . '",';
		// 	$outpm .= '"product_name":"'  . $rss["product_name"] . '",';
		// 	$outpm .= '"description":"'  . $rss["product_desc"] . '",';
		// 	$outpm .= '"quantity":'  . $rss["quantity"] . ',';
		// 	$outpm .= '"partial_price":'  . $rss["partial_price"] . ',';
		// 	$outpm .= '"price":'  . $rss["price"] . ',';
		// 	$outpm .= '"partial_weight":'  . $rss["partial_weight"] . ',';
		// 	$outpm .= '"weight":'  . $rss["weight"] . ',';
		// 	$outpm .= '"establishment":"'  . $rss["establishment"] . '",';
		// 	$outpm .= '"postal":"'  . $rss["postal"] . '",';
		// 	$outpm .= '"bill_number":"'  . $rss["bill_number"] . '",';
		// 	$outpm .= '"bill_name":"'  . $rss["bill_name"] . '",';
		// 	$outpm .= '"bill_file":"'  . $rss["bill_file"] . '",';
		// 	$outpm .= '"tracking_number":"'   . $rss["tracking_number"].'"}';
		// }

		// $outp .='"products":['.$outpm.'],';
		$outp .= '"timestamp":"'   . $rs["timestamp"]  . '"}';
	}
	$outp ='{"ventas":['.$outp.']}';

	echo($outp);
}

function getByBatchId ($data) {

}

function getByUserId ($data) {

}
?>