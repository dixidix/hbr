<?php
require './../bd.php';
	$res = MysqliDB::getInstance()->query("SELECT awb_enter_box.*, awb_boxes.tracking, awb_boxes.provider,awb_boxes.stock, awb_boxes.whId,  awb_boxes.remaining, awb_boxes.uid, awb_boxes.weight as box_weight, awb_boxes.value as box_value FROM awb_enter_box INNER JOIN `awb_boxes` WHERE awb_enter_box.awb_boxes_id = awb_boxes.id AND awb_enter_box.deleted = 0");
    $outp="";
	
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"box_stock":'  . (int) $rs["stock"] . ',';
		$outp .= '"quantity":'  . (int) $rs["quantity"] . ',';
		$outp .= '"remaining":'  . (int) $rs["remaining"] . ',';
		$outp .= '"awb_boxes_id":'  . (int) $rs["awb_boxes_id"] . ',';
        $outp .= '"box_value":'  . (float) $rs["box_value"] . ',';
		$outp .= '"box_weight":'  . (float) $rs["box_weight"] . ',';
		$outp .= '"box_partial_weight":'  . (float) $rs["weight"] . ',';
		$outp .= '"box_partial_value":'  . (float) $rs["value"] . ',';
        $outp .= '"long_desc":"'  . $rs["descrip"] . '",';
		$outp .= '"created":"'  . $rs["created"] . '",';
		$outp .= '"status":"'  . $rs["status"] . '",';
		$outp .= '"tracking":"'  . $rs["tracking"] . '",';
		$outp .= '"provider":"'  . $rs["provider"] . '",';
		$outp .= '"box_warehouse_value":"'  . $rs["box_warehouse_value"] . '",';
		$outp .= '"aditional_unit":"'  . $rs["aditional_unit"] . '",';
		$outp .= '"aditional_value":"'  . $rs["aditional_value"] . '",';
		$outp .= '"aditional_total":"'  . $rs["aditional_total"] . '",';
		$outp .= '"status":"'  . $rs["status"] . '",';
        $outpwh="";

		$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . $rs["whId"] . " and deleted = 0");
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

		$outp .='"warehouse":'.$outpwh.',';

        $uname = MysqliDB::getInstance()->query("SELECT * FROM awb_box_bills where boxId =" . (int) $rs["awb_boxes_id"] . " and deleted = 0");
		while($rss = $uname->fetch_array(MYSQLI_ASSOC)) {
			$outpmn = "";
			if ($outpm != "") {$outpm .= ",";}
			$outpm .= '{"id":"'   . $rss["id"].'",';
			$outpm .= '"uid":"'  . $rss["uid"] . '",';
			$outpm .= '"timestamp":"'  . $rss["timestamp"] . '",';
			$outpm .= '"number":"'  . $rss["number"] . '",';
			$outpm .= '"stock":"'  . $rss["stock"] . '",';
			$outpm .= '"value":"'  . $rss["value"] . '",';
			$outpm .= '"weight":"'  . $rss["weight"] . '",';
			$outpm .= '"long_desc":"'  . $rss["long_desc"] . '",';
			$outpm .= '"bill_file_name":"'  . $rss["bill_file_name"] . '",';
			$outpm .= '"bill_file_path":"'   . $rss["bill_file_path"].'"}';
		}

		$outp .='"bills":['.$outpm.'],';

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
			$outpmmn .= '"id":"'  . $rsss["id"] . '",';
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

		$outp .='"user":'.$outpmmn.',';
        $outp .= '"deleted":"'   . $rs["deleted"].'"}';
	}
	$outp ='{"boxes":['.$outp.']}';

	echo($outp);
?>