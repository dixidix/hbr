<?php
require './../bd.php';
require './../PHPMailer-master/PHPMailerAutoload.php';

$_POST = json_decode(file_get_contents('php://input'), true);
$errors = array();
$data = array();

$mail = new PHPMailer;

$mail->SMTPDebug = 2;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'santiago.lloret@tucourier.com.ar';                 // SMTP username
$mail->Password = 'reset2016';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$action =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['action']));

if($action === "whLeaveDate"){
    $ventaId = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
    $guide_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['guide_number']));
    $email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));

    $body = file_get_contents('./../emails/wh-leave-date.template.html', FILE_USE_INCLUDE_PATH);    

    $wh_leave_date =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_leave_date']));
    $wh_name =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));
    $user =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['user']));



    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $whLeaveDateParsed =  date('d-m-Y', $wh_leave_date);

    $htmlStringToReplace = array('$ventaId','$guide_number', '$whLeaveDateParsed', '$wh_name', '$user');
    $replaceWith   = array("$ventaId","$guide_number", "$whLeaveDateParsed", "$wh_name", "$user");

    $body = str_replace($htmlStringToReplace, $replaceWith, $body);

    $to = "santiago.lloret@tucourier.com.ar";
    $name = "HBR | tu courier";
    $subject = "Warehouse Leave Date for ".$user." Lot: ".$ventaId." - AWB: ".$guide_number;
    $mail->CharSet = 'UTF-8';
    $mail->AddReplyTo($email);
    $mail->SetFrom($to, $name);
    $mail->Subject = $subject;
    $mail->AddAddress($to);
    $mail->Body    = $body;
    $mail->AltBody = "Warehouse Leave Date for ".$user." Lot: ".$ventaId." - AWB: ".$guide_number;

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }
} 
if($action === "whEnterDate"){
    $ventaId = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
    $bill_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['bill_number']));
    $email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));

    $body = file_get_contents('./../emails/wh-arrival-date.template.html', FILE_USE_INCLUDE_PATH);    

    $wh_enter_date =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['wh_enter_date']));
    $wh_name =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));
    $user =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['user']));

    $today =  date('d-m-Y');
    $whDateNotificationText = "";
    $enter_date = strtotime($wh_enter_date);
    $today_date = strtotime($today);
    if($wh_enter_date > $today_date){
        $whDateNotificationText = "ya posee fecha de entrada al warehouse";
    } else {
        $whDateNotificationText = "ya se encuentra en el warehouse";
    }
    
    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $whEnterDateParsed =  date('d-m-Y', $wh_enter_date);

    $htmlStringToReplace = array('$ventaId','$bill_number', '$whEnterDateParsed','$whDateNotificationText', '$wh_name', '$user');
    $replaceWith   = array("$ventaId","$bill_number", "$whEnterDateParsed","$whDateNotificationText", "$wh_name", "$user");

    $body = str_replace($htmlStringToReplace, $replaceWith, $body);

    $to = "santiago.lloret@tucourier.com.ar";
    $name = "HBR | tu courier";
    $subject = "Warehouse Arrival Date for ".$user." Lot: ".$ventaId." - Bill N°: ".$bill_number;
    $mail->CharSet = 'UTF-8';
    $mail->AddReplyTo($email);
    $mail->SetFrom($to, $name);
    $mail->Subject = $subject;
    $mail->AddAddress($to);
    $mail->Body    = $body;
    $mail->AltBody = "Warehouse Arrival Date for ".$user." Lot: ".$ventaId." - Bill N°: ".$bill_number;

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }
}
?>