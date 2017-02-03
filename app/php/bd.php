<?php
ini_set('default_charset', 'UTF-8');
class MysqliDB{
	private static $_instance;
//--------------DB SERVER---------------
	// protected $host='localhost';
	// protected $user='feedback_hbrusr';
	// protected $passwd='reset2016';
	// protected $db='feedback_tucourier';
//--------------DB LOCALHOST--------------
protected $host='localhost';
protected $user='root';
protected $passwd='';
protected $db='feedback_tucourier';
//----------------------------------------
	protected $_mysqli;
	public static function getInstance() { //singleton pattern
		if(!self::$_instance) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}
	private function __construct(){
		MysqliDB::connect();
	}
	public function connect()
	{
		$this->_mysqli = new mysqli ($this->host, $this->user, $this->passwd, $this->db);
		 mysqli_set_charset($this->_mysqli, "utf8"); 
		if (mysqli_connect_errno()) {
			die( "Fallo la conexión a MySQL: (" . mysqli_connect_errno() . ") " . mysqli_connect_error());
		}
	}
	public function close(){
		mysqli_close($this->_mysqli);
	}
	public function error(){
		return $this->_mysqli->error;
	}
	public function query($query)
	{
		return $this->_mysqli->query($query);
	}
	public function double_scape($str)
	{
		$str = str_replace("\\r","\\\\r",$str);
		$str = str_replace("\\n","\\\\n",$str);
		return $str;
	}   
	public function replace_double_scape($str)
	{
		$str = str_replace("\\r\\n",",",$str);
		return $str;
	}  
	public function mysql_real_escape_string($str)
	{
		return $this->_mysqli->real_escape_string(addcslashes($str, '"'));
	}
}
?>