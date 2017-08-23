<?php
require 'bd.php';
require './PHPMailer-master/PHPMailerAutoload.php';

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
$mail->SMTPSecure="ssl";                          // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$body = file_get_contents('./emails/notificacion_venta.template.html', FILE_USE_INCLUDE_PATH);
$email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));
$date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['date']));
$lote = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['lote']));
$name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));

$htmlStringToReplace = array('$email','$date','$lote','$name');
 $replaceWith   = array("$email","$date",$lote, "$name");
$body = str_replace($htmlStringToReplace, $replaceWith, $body);

$to = "santiago.lloret@tucourier.com.ar";
$name = "HBR | tu courier";
$subject = "Notificacion de venta";
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($to);
$mail->Body    = $body;
$mail->AltBody = "notificación de venta de: $name . Lote n° $lote";

if(!$mail->send()) {
	echo 'Message could not be sent.';
	echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
	echo 'Message has been sent';
}
?>