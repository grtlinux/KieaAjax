<?php
	require("util.php");
	
	header("Content-type: text/xml; charset=euc-kr");
	header("Pragma: no-cache");
	header("Cache-Control: no-cache,must-revalidate");
	
	echo "<?xml version='1.0' encoding='euc-kr' ?>";
?>

<result>
	<code>success</code>
	<data><![CDATA[
	[
<?php
	$db = mysql_connect('localhost', 'root', 'root');
	mysql_select_db("test", $db);
	
	$result = mysql_query("select * from COMMENT order by ID");
	
	for($i = 0 ; $row = mysql_fetch_array($result) ; $i++) {
		if ($i > 0) echo ",\r\n";

		$name = toJS($row[NAME]);
		$content = toJS($row[CONTENT]);
		
		echo "{\r\n";
		echo "id: $row[ID],";
		echo "name: \"$name\",";
		echo "content: \"$content\"";
		echo "}\r\n";
	}
	mysql_close($db);
?>
	]
	]]></data>
</result>
