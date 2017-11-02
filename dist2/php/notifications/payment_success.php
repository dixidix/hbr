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

$ventaId = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
$guide_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['guide_number']));
$email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));

$body = file_get_contents('./../emails/payment-success.template.html', FILE_USE_INCLUDE_PATH);    

$hbr_tracking =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['hbr_tracking']));
$arrivalDate =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['arrivalDate']));
$leaveDate =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['leaveDate']));
$estimatedArrivalDate =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['estimatedArrivalDate']));
$hbr_postal_provider =  MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['hbr_postal_provider']));

date_default_timezone_set('America/Argentina/Buenos_Aires');

$leaveDateHtml   = "";
$arrivalDateHtml = "";
$estimatedArrivalDateHtml = "";

$htmlStringToReplace = array('$ventaId','$guide_number','$hbr_tracking', '$hbr_postal_provider');
$replaceWith   = array("$ventaId","$guide_number",$hbr_tracking, "$hbr_postal_provider");
$body = str_replace($htmlStringToReplace, $replaceWith, $body);

if($leaveDate){
    $leaveDateParsed =  date('d-m-Y', $leaveDate);
    $leaveDateHtmlParsed   = "<li><strong>Fecha de salida de Buenos aires:</strong> $leaveDateParsed </li>";
    $body = str_replace('$leaveDateHtml', "$leaveDateHtmlParsed", $body);
}else{
    $body = str_replace('$leaveDateHtml', "", $body);
}

if($arrivalDate){
    $arrivalDateParsed =  date('d-m-Y', $arrivalDate);    
    $arrivalDateHtmlParsed = "<li><strong>Fecha de llegada a Buenos Aires:</strong> $arrivalDateParsed </li>";
    $body = str_replace('$arrivalDateHtml', "$arrivalDateHtmlParsed", $body);
} else {
    $body = str_replace('$arrivalDateHtml', "", $body);
}

if($estimatedArrivalDate){
    $estimatedArrivalDateParsed =  date('d-m-Y', $estimatedArrivalDate);    
    $estimatedArrivalDateHtmlParsed   = "<li><strong>Fecha estimada de llegada a tu dirección de entrega:</strong> $estimatedArrivalDateParsed </li>";
    $body = str_replace('$estimatedArrivalDateHtml', "$estimatedArrivalDateHtmlParsed", $body);
} else {
    $body = str_replace('$estimatedArrivalDateHtml',"", $body);
}

$to = "'santiago.lloret@tucourier.com.ar";
$name = "HBR | tu courier";
$subject = "Notificación de pago";
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($email);
$mail->Body    = $body;
$mail->AltBody = "Notificacion de pago de: $name . Guía n° $guide_number";

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>