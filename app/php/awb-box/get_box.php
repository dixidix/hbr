<?php
require './../bd.php';


	$res = MysqliDB::getInstance()->query("SELECT * from awb_boxes WHERE  deleted = 0");
	$outp="";	
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {		
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"uid":"'  . $rs["uid"] . '",';
        $outp .= '"tracking":"'  .  $rs["tracking"] . '",';
        $outp .= '"provider":"'  . $rs["provider"] . '",';
        $outp .= '"box_stock": '  . (int) $rs["stock"] . ',';
        $outp .= '"box_value":'  . (float) $rs["value"] . ',';
		$outp .= '"box_weight":'  . (float) $rs["weight"] . ',';
		$outp .= '"status":'  . (int) $rs["status"] . ',';
		$outpwh="";
		$wh =  MysqliDB::getInstance()->query("SELECT * FROM users where id =" . (int) $rs["whId"] . " and deleted = 0");
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

	
        $uname = MysqliDB::getInstance()->query("SELECT * FROM awb_box_bills where boxId =" . (int) $rs["id"] . " and deleted = 0");
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
        $outp .= '"created":"'   . $rs["created"].'"}';
	}
	$outp ='{"awb_boxes":['.$outp.']}';

	echo($outp);
?>