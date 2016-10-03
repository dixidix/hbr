<?php

$_POST = json_decode(file_get_contents('php://input'), true);
$data = array();
$method = $_SERVER['REQUEST_METHOD'];

$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

function adduser(){
  echo $data['data'];
}
function editUser(){
 echo $data['data'];
}
function getUsers(){
  if(!empty($_GET['data'])){
    echo $_GET['data'];
  }else{
    echo "getAll";
  }
}
function deleteUser(){
 echo $data['data'];
}
switch ($method) {
  case 'PUT':
  $data = json_decode(file_get_contents("php://input"), true);
  editUser();
  break;
  case 'POST':
  $data = $_POST;
  addUser();
  break;
  case 'GET':
  $data = $_GET;
  getUsers();
  break;
  case 'DELETE':
  $data = $_POST;
  deleteUser();
  break;
  default:
  echo "Error";
  break;
}

?>