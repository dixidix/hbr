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
$mail->Password = 'Reset2016';                           // SMTP password
$mail->SMTPSecure="ssl";                          // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$ventaId = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['ventaId']));
$guide_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['guide_number']));
$total = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['total']));
$email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));

if(!empty($_POST['paymentMethod']) && $_POST['paymentMethod'] == 1){

    $body = file_get_contents('./../emails/payment-method-todopago.template.html', FILE_USE_INCLUDE_PATH);    

    $paymentButton =  nl2br(stripslashes($_POST['paymentButton']));

    $htmlStringToReplace = array('$ventaId','$guide_number','$paymentButton', '$total');
    $replaceWith   = array("$ventaId","$guide_number",$paymentButton, "$total");

}

if(!empty($_POST['paymentMethod']) && $_POST['paymentMethod'] == 2){

    $body = file_get_contents('./../emails/payment-method-transfer.template.html', FILE_USE_INCLUDE_PATH);    

    $transfer_account_number = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['transfer_account_number']));
    $transfer_account_holder_name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['transfer_account_holder_name']));
    $transfer_bank_name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['transfer_bank_name']));
    $transfer_bank_address = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['transfer_bank_address']));
    $paymentDesc = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['paymentDesc']));


    $htmlStringToReplace = array('$ventaId','$guide_number','$transfer_account_number','$transfer_account_holder_name','$transfer_bank_name','$transfer_bank_address','$paymentDesc', '$total');
    $replaceWith   = array("$ventaId","$guide_number","$transfer_account_number","$transfer_account_holder_name","$transfer_bank_name", "$transfer_bank_address","$paymentDesc","$total");
}


if(!empty($_POST['paymentMethod']) && $_POST['paymentMethod'] == 3){

    $body = file_get_contents('./../emails/payment-method-cash.template.html', FILE_USE_INCLUDE_PATH);    

    $htmlStringToReplace = array('$ventaId','$guide_number', '$total');
    $replaceWith   = array("$ventaId","$guide_number","$total");

}

$body = str_replace($htmlStringToReplace, $replaceWith, $body);

$to = "santiago.lloret@tucourier.com.ar";
$name = "HBR | tu courier";
$subject = "Notificación de cobro";
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($email);
$mail->Body    = $body;
$mail->AltBody = "Notificacion de cobro de: $name . Guía n° $guide_number";

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>