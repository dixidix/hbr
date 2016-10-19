<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$hash = $_POST['timestamp'];
$hash = md5(stripslashes($hash));

echo $hash;
?>