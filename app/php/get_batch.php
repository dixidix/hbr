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
		$outp .= '"total_weight":"'  . $rs["totalweight"] . '",';
		$outp .= '"total": '  . $rs["total"] . ',';
		$outp .= '"total_quantity":"'  . $rs["total_quantity"] . '",';
		$outp .= '"total_remaining_quantity":"'  . $rs["total_remaining_quantity"] . '",';
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
				$outpmn .= '"userId":"'   . $rsss["userId"].'"}';
			}

			$outpm .='"products":['.$outpmn.'],';

			$outpm .= '"userId":"'  . $rss["userId"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
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

function getByUserId ($data) {

}
?>