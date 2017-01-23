<?php
require 'bd.php';

$action = $_GET['action'];

switch ($action) {
    case 'getAll': getAll();
        break;
    case 'getByPurchaseId': getByPurchaseId($_GET['ventaId']);
        break;
    case 'getByUserId': getByUserId();
        break;
    default: print_r($errors);
        break;
}

function getByPurchaseId($ventaId){

$res = MysqliDB::getInstance()->query("SELECT * from airway_bill WHERE ventaId = ".$ventaId." AND deleted = 0");
	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"airwayId":"'  . $rs["airwayId"] . '",';
		$outp .= '"ventaId":"'  . $rs["ventaId"] . '",';
        $outp .= '"number":"'  . (float) $rs["number"] . '",';

        $uname = MysqliDB::getInstance()->query("SELECT * FROM airway_bill_product INNER JOIN categories ON airway_bill_product.category_id = categories.category_id where  airway_bill_product.airwayId =".$rs["airwayId"]." AND airway_bill_product.deleted = 0");
		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"awb_productId":"'   . $rss["awb_productId"].'",';
			$outpm .= '"product_id":"'  . $rss["product_id"] . '",';
			$outpm .= '"airwayId":"'  . $rss["airwayId"] . '",';
			$outpm .= '"category_id":"'  . $rss["category_id"] . '",';
			$outpm .= '"category_name":"'  . $rss["category_name"] . '",';
			$outpm .= '"name":"'  . $rss["name"] . '",';
			$outpm .= '"price":"'  . $rss["price"] . '",';
			$outpm .= '"quantity":"'  . $rss["quantity"] . '",';
			$outpm .= '"total_price":"'  . $rss["total_price"] . '",';
			$outpm .= '"real_weight":"'  . $rss["real_weight"] . '",';
			$outpm .= '"total_weight":"'  . $rss["total_weight"] . '",';
			$outpm .= '"userId":"'   . $rss["userId"].'"}';
		}

		$outp .='"products":['.$outpm.'],';
		$outp .= '"quantity":"'  . $rs["quantity"] . '",';
		$outp .= '"weight": '  . $rs["weight"] . ',';
		$outp .= '"price":"'  . $rs["price"] . '",';
        $outp .= '"state":"'   . $rs["state"].'"}';
	}
	$outp ='{"guideBatch":['.$outp.']}';

	echo($outp);
}

function getAll ($data) {

}

function getByUserId ($data) {

}
?>