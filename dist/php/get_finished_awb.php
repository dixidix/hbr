<?php
require 'bd.php';



if(!empty($_GET['state'])){
	$res = MysqliDB::getInstance()->query("SELECT * from airway_bill INNER JOIN ventas ON airway_bill.ventaId = ventas.id  WHERE airway_bill.state != 0 AND  airway_bill.deleted = 0");
} else {
	if(!empty($_GET['ventaId'])){	
	$res = MysqliDB::getInstance()->query("SELECT * from airway_bill WHERE ventaId = ".$_GET['ventaId']." AND deleted = 0");
	}
}

	$outp="";
	$outpwh="";
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"airwayId":"'  . $rs["airwayId"] . '",';
		$outp .= '"ventaId":"'  . $rs["ventaId"] . '",';
        $outp .= '"number":"'  . (int) $rs["number"] . '",';
        $outp .= '"whId":"'  . (int) $rs["warehouseId"] . '",';

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

		$outp .= '"quantity":"'  . $rs["quantity"] . '",';
		$outp .= '"weight":"'  .(float) $rs["weight"] . '",';
		$outp .= '"price":"'  . (float)$rs["price"] . '",';
		$outp .= '"state":"'  . $rs["state"] . '",';

		$outp .= '"warehouse_enter":"'  . (float)$rs["warehouse_enter"] . '",';
		$outp .= '"warehouse_aditional_weight":"'  . (float)$rs["warehouse_aditional_weight"] . '",';
		$outp .= '"warehouse_aditional_charges":"'  . (float)$rs["warehouse_aditional_charges"] . '",';
		$outp .= '"warehouse_total":"'  . (float)$rs["warehouse_total"] . '",';

		$outp .= '"shipment_international":"'  . (float)$rs["shipment_international"] . '",';
		$outp .= '"shipment_total":"'  . (float)$rs["shipment_total"] . '",';

		$outp .= '"hbr_postal_provider":"'  . $rs["hbr_postal_provider"] . '",';
		$outp .= '"hbr_tracking":"'  . $rs["hbr_tracking"] . '",';

		$outp .= '"paymentMethod":"'  . $rs["paymentMethod"] . '",';
		$outp .= '"transfer_account_number":"'  . $rs["transfer_account_number"] . '",';
		$outp .= '"transfer_account_holder_name":"'  . $rs["transfer_account_holder_name"] . '",';
		$outp .= '"transfer_bank_name":"'  . $rs["transfer_bank_name"] . '",';
		$outp .= '"transfer_bank_address":"'  . $rs["transfer_bank_address"] . '",';
		$outp .= '"paymentDesc":"'  . $rs["paymentDesc"] . '",';

		$outp .= '"arrivalDate":"'  . $rs["arrivalDate"] . '",';
		$outp .= '"leaveDate":"'  . $rs["leaveDate"] . '",';
		$outp .= '"token":"'  . $rs["token"] . '",';
		$outp .= '"successUrl":"'  . $rs["successUrl"] . '",';
		$outp .= '"paymentButton":"'  . $rs["paymentButton"] . '",';
		$outp .= '"hbr_tracking":"'  . $rs["hbr_tracking"] . '",';
		$outp .= '"hbr_postal_provider":"'  . $rs["hbr_postal_provider"] . '",';

		$outp .= '"billing_total":"'  . (float)$rs["billing_total"] . '",';

        $outp .= '"venta_userId":"'  . (float) $rs["uid"] . '",';
        $outp .= '"venta_parcial_price":"'  . (float) $rs["parcial_price"] . '",';
        $outp .= '"venta_total":"'  . (float) $rs["total"] . '",';
        $outp .= '"venta_total_quantity":"'  . (float) $rs["total_quantity"] . '",';
        $outp .= '"venta_total_remaining_quantity":"'  . (float) $rs["total_remaining_quantity"] . '",';
        $outp .= '"venta_timestamp":"'  . (float) $rs["timestamp"] . '",';
        $outp .= '"venta_state":"'  . (float) $rs["state"] . '",';
        $outp .= '"venta_totalweight":"'  . (float) $rs["totalweight"] . '",';

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

		$unamee = MysqliDB::getInstance()->query("SELECT * FROM users  where  id =".$rs["uid"]." AND deleted = 0");
		while($rsss = $unamee->fetch_array(MYSQLI_ASSOC)) {
			$outpmmn = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpmmn .= '{"name":"'   . $rsss["name"].'",';
			$outpmmn .= '"lastname":"'  . $rsss["lastname"] . '",';
			$outpmmn .= '"company_real_name":"'  . $rsss["company_real_name"] . '",';
			$outpmmn .= '"warehouse_name":"'  . $rsss["warehouse_name"] . '",';
			$outpmmn .= '"tel":"'  . $rsss["tel"] . '",';
			$outpmmn .= '"cel":"'  . $rsss["cel"] . '",';
			$outpmmn .= '"email":"'  . $rsss["email"] . '",';
			$outpmmn .= '"codeType":"'  . $rsss["codeType"] . '",';
			$outpmmn .= '"idCode":"'  . $rsss["idCode"] . '",';
			$outpmmn .= '"address":"'  . $rsss["address"] . '",';
			$outpmmn .= '"localidad":"'  . $rsss["localidad"] . '",';
			$outpmmn .= '"postalcode":"'  . $rsss["postalcode"] . '",';
			$outpmmn .= '"isAdmin":"'  . $rsss["isAdmin"] . '",';
			$outpmmn .= '"isPremium":"'  . $rsss["isPremium"] . '",';
			$outpmmn .= '"client_type":"'  . $rsss["client_type"] . '",';
			$outpmmn .= '"company_name":"'   . $rsss["company_name"].'"}';
		}

		$outp .='"user":['.$outpmmn.'],';
        $outp .= '"venta_guide_amount":"'   . $rs["guide_amount"].'"}';
	}
	$outp ='{"guideBatch":['.$outp.']}';

	echo($outp);
?>