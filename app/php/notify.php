<?php
require './bd.php';
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
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$msg = $_POST['msg'];
$msg_subject = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['msg_subject']));
$client_email = MysqliDB::double_scape(MysqliDB::getInstance()->mysql_real_escape_string($_POST['client_email']));

$body = file_get_contents('./emails/notify.template.html', FILE_USE_INCLUDE_PATH);    

date_default_timezone_set('America/Argentina/Buenos_Aires');

$htmlStringToReplace = array('$msg');
$replaceWith   = array("$msg");

$body = str_replace($htmlStringToReplace, $replaceWith, $body);

$to = "santiago.lloret@tucourier.com.ar";
$name = "HBR | tu courier";
$subject = $msg_subject;
$mail->CharSet = 'UTF-8';
$mail->AddReplyTo($to);
$mail->SetFrom($to, $name);
$mail->Subject = $subject;
$mail->AddAddress($client_email);
$mail->Body    = $body;
$mail->AltBody = $msg;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>