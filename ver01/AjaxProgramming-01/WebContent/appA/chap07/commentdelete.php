<?php
	require("util.php");

	header("Content-type: text/xml; charset=euc-kr");
	header("Pragma: no-cache");
	header("Cache-Control: no-cache,must-revalidate");
	
	echo "<?xml version='1.0' encoding='euc-kr' ?>";

	$db = mysql_connect('localhost', 'root', 'root');
	mysql_select_db("test", $db);
	
	$deleteResult = mysql_query("delete from COMMENT where ID = $id", $db);
	
	mysql_close($db);
	
	echo "<result>";
	echo "<code>success</code>";
	echo "<id>$id</id>";
	echo "</result>";
?>	
