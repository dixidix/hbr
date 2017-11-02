<?php 
    require './../bd.php';

    $errors = array();
    $resolve_data = array();

    $id = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['id']));
    $edited = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['edited']));
    $timestamp = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['created']));
    $status = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['status']));
    $travel_status = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['travel_status']));
    $wh_tracking = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_tracking']));
    $bsas_tracking = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bsas_tracking']));
    $wh_provider =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_provider']));
    $bsas_provider =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bsas_provider']));
    $wh_arrival_date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_arrival_date']));
    $wh_leave_date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_leave_date']));
    $bsas_arrival_date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bsas_arrival_date']));
    $bsas_leave_date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bsas_leave_date']));
    $customer_arrival_date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['customer_arrival_date']));

    $file_name_bill = !empty($_POST['bill_file_name']) ? $_POST['bill_file_name'] : null;
    $path_bill = !empty($_POST['bill_file_path']) ? $_POST['bill_file_path'] : null;
    
    if(!empty($_FILES['bill_file'])){
        $file_name_bill = $_FILES['bill_file']['name'];
        $file_name_bill = str_replace(' ', '_', $file_name_bill);
        $file_size_bill =$_FILES['bill_file']['size'];
        $file_tmp_bill = $_FILES['bill_file']['tmp_name'];
        $file_type_bill =$_FILES['bill_file']['type'];
        $file_ext_bill = strtolower(pathinfo($file_name_bill, PATHINFO_EXTENSION));
        $fileSystemname_bill = $file_name_bill . $timestamp;
        $fileSystemname_bill = hash('sha256', $fileSystemname_bill);
        $fileSystemname_bill = "$fileSystemname_bill.$file_ext_bill";
        $tmp_path_bill = "./../../files/".$timestamp."/".$fileSystemname_bill;
        $path_bill = "/dist/files/".$timestamp."/".$fileSystemname_bill;
    } 

    if(!file_exists("./../../files/".$timestamp."/")){
        mkdir("./../../files/".$timestamp."/");
        if(!empty($_FILES['bill_file'])){
            move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
        }
    } else {
        if(!empty($_FILES['bill_file'])){
            move_uploaded_file($file_tmp_bill, "$tmp_path_bill");
        }
    }


    if (empty($errors)){
    if(empty($file_name_bill) && empty($path_bill)){
        $file_name_bill = null;
        $path_bill = null;
    }

    MysqliDB::getInstance()->query("UPDATE `awb_shipping_box` SET `edited`='".$edited."',`status`=".(int)$status.",`travel_status`=".(int)$travel_status.",`wh_tracking`='". $wh_tracking."',`bsas_tracking`='".$bsas_tracking."',`wh_provider`='".$wh_provider."', `bsas_provider`='".$bsas_provider."', `wh_arrival_date`='".$wh_arrival_date."', `wh_leave_date`='".$wh_leave_date."', `bsas_arrival_date`='".$bsas_arrival_date."', `bsas_leave_date`='".$bsas_leave_date."', `customer_arrival_date`='".$customer_arrival_date."', `bill_file_name`='".$file_name_bill."',`bill_file_path`='".$path_bill."' WHERE `id` = ".(int)$id."");
    $resolve_data['success'] = true;	
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
    } else {
    $resolve_data['errors'] = $errors;
    MysqliDB::getInstance()->close();
    echo json_encode($resolve_data);
    }

?>