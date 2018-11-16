<?php
	require("util.php");
	
	header("Content-type: text/xml; charset=euc-kr");
	header("Pragma: no-cache");
	header("Cache-Control: no-cache,must-revalidate");
	
	echo "<?xml version='1.0' encoding='euc-kr' ?>";
	
	$name = iconv("utf-8", "euc-kr", $name);
	$content = iconv("utf-8", "euc-kr", $content);
	
	$db = mysql_connect('localhost', 'root', 'root');
	mysql_select_db("test", $db);
	
	$resultId = mysql_query("select VALUE from ID_REPOSITORY where NAME='COMMENT'", $db);
	$row = mysql_fetch_array($resultId);
	$nextId = $row[VALUE];
	$nextId ++;
	
	$updateResult = mysql_query("update ID_REPOSITORY set VALUE = $nextId where NAME='COMMENT'", $db);
	$insertResult = mysql_query("insert into COMMENT values ($nextId, '$name', '$content')", $db);
	
	mysql_close($db);
	
	$name = toJS(stripslashes($name));
	$content = toJS(stripslashes($content));
?>
<result>
	<code>success</code>
	<data><![CDATA[
	{
<?php
	echo "id: $nextId,";
	echo "name: \"$name\",";
	echo "content: \"$content\""
?>
	}
	]]></data>
</result>
