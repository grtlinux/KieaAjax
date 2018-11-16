<?php
	function toJS($str) {
		$str = str_replace("\\", "\\\\", $str);
		$str = str_replace("'", "\\'", $str);
		$str = str_replace("\"", "\\\"", $str);
		$str = str_replace("\r\n", "\\n", $str);
		$str = str_replace("\n", "\\n", $str);
		return $str;
	}
?>