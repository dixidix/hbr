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
$mail->Username = 'nicolas.sigal@gmail.com';                 // SMTP username
$mail->Password = 'panchirulo173';                           // SMTP password
$mail->SMTPSecure="ssl";                          // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$body = file_get_contents('./emails/solicitud_venta.template.html', FILE_USE_INCLUDE_PATH);
$email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));
$date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['date']));
$lote = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['lote']));
$name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));

date_default_timezone_set('America/Argentina/Buenos_Aires');
$date =  date('Y-m-d H:i:s', $date);

$htmlStringToReplace = array('$email','$date','$lote','$name');
 $replaceWith   = array("$email","$date",$lote, "$name");
$body = str_replace($htmlStringToReplace, $replaceWith, $body);

$to = "nicolas.sigal@gmail.com";
$name = "HBR | tu courier";
$subject = "Solicitud de venta";
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($to);
$mail->Body    = $body;
$mail->AltBody = "Solicitud de venta de: $name . Lote n° $lote";

if(!$mail->send()) {
	echo 'Message could not be sent.';
	echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
	echo 'Message has been sent';
}
?>