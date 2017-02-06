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
$mail->SMTPSecure="tls";                          // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$body = file_get_contents('./emails/solicitud_venta.template.html', FILE_USE_INCLUDE_PATH);
$email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['email']));
$date = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['date']));
$lote = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['lote']));
$name = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['name']));

if(!empty($_POST['whEmail'])){
	$whEmail = $_POST['whEmail'];
}

date_default_timezone_set('America/Argentina/Buenos_Aires');
$dateParsed =  date("m/d/Y H:i");

$htmlStringToReplace = array('$email','$date','$lote','$name');
 $replaceWith   = array("$email","$dateParsed",$lote, "$name");
$body = str_replace($htmlStringToReplace, $replaceWith, $body);

$to = "santiago.lloret@tucourier.com.ar";
$name = "HBR | tu courier";
$subject = "Solicitud de venta";
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($to);

if(!empty($_POST['whEmail'])){	
	foreach ($whEmail as &$email) {				
   		$mail->AddBCC($email);
	}
}

$mail->Body    = $body;
$mail->AltBody = "Solicitud de venta de: $name . Lote n° $lote";

if(!$mail->send()) {
	echo 'Message could not be sent.';
	echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
	echo 'Message has been sent';
}
?>