<?php
	header("Content-Type: text/plain; charset=euc-kr");
	$name = iconv("utf-8", "euc-kr", $name);
	echo "안녕하세요, $name 회원님!";
?>