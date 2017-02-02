<?php
require 'bd.php';

$action = $_GET['action'];

switch ($action) {
    case 'getAll': getAll();
        break;
    case 'getByPurchaseId': getByPurchaseId();
        break;
    case 'getByUserId': getByUserId();
        break;
    default: print_r($errors);
        break;
}

function getByPurchaseId(){
if(!empty($_GET['state'])){
	$res = MysqliDB::getInstance()->query("SELECT * from airway_bill INNER JOIN ventas ON airway_bill.ventaId = ventas.id  WHERE airway_bill.state = ".$_GET['state']." AND  airway_bill.deleted = 0");
} else {
	if(!empty($_GET['ventaId'])){	
	$res = MysqliDB::getInstance()->query("SELECT * from airway_bill WHERE ventaId = ".$_GET['ventaId']." AND deleted = 0");
	}
}

	$outp="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		$outpwh ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"airwayId":"'  . $rs["airwayId"] . '",';
		$outp .= '"ventaId":"'  . $rs["ventaId"] . '",';
        $outp .= '"number":"'  . (float) $rs["number"] . '",';
        $outp .= '"whId":"'  . (float) $rs["warehouseId"] . '",';

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

			$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . $rs["warehouseId"] . " and deleted = 0");
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

			$outp .='"warehouse":['.$outpwh.'],';

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