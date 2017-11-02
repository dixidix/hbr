<?php
require './../bd.php';

if(!empty($_GET['uid'])){
	$res = MysqliDB::getInstance()->query("SELECT * from boxes WHERE boxes.uid = ".$_GET['uid']." AND  boxes.deleted = 0");
    $outp="";
	
	while($rs = $res->fetch_array(MYSQLI_ASSOC)) {
		$outpm ="";
		if ($outp != "") {$outp .= ",";}

		$outp .= '{"id":"'  . $rs["id"] . '",';
		$outp .= '"bill":"'  . $rs["bill"] . '",';
        $outp .= '"box_stock":'  . (int) $rs["stock"] . ',';
        $outp .= '"box_value":'  . (float) $rs["value"] . ',';
        $outp .= '"box_weight":'  . (float) $rs["weight"] . ',';
        $outp .= '"long_desc":"'  . $rs["long_desc"] . '",';
		$outp .= '"short_desc":"'  . $rs["short_desc"] . '",';
		$outp .= '"created":"'  . $rs["created"] . '",';
		$outp .= '"edited":"'  . $rs["edited"] . '",';
		$outp .= '"box_shipping_value":'  . (float) $rs["shipping"] . ',';
		$outp .= '"box_warehouse_value":'  . (float) $rs["warehouse"] . ',';
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
        $outp .= '"location":"'   . $rs["location"].'"}';
	}
	$outp ='{"boxes":['.$outp.']}';
} else {
    $outp ='{"boxes":[]}';
}

	echo($outp);
?>