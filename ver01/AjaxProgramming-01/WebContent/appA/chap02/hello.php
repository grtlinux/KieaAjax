<?php
	header("Content-Type: text/plain; charset=euc-kr");
	$name = iconv("utf-8", "euc-kr", $name);
	echo "�ȳ��ϼ���, $name ȸ����!";
?>