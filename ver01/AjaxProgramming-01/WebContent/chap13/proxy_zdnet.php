<?php
	$fp = fsockopen ("www.zdnet.co.kr", 80, $errno, $errstr, 30);
	
	if (!$fp) {
		echo "$errstr ($errno)<br>\n";
	} else {
		fputs($fp, "GET /services/rss/all/rss2.0.htm HTTP/1.1\r\n");
		fputs($fp, "Host: www.zdnet.co.kr\r\n");
		fputs($fp, "Connection: Close\r\n\r\n");
		
		$header = "";
		while (!feof($fp)) {
			$out = fgets ($fp,512);
			if (trim($out) == "") {
				break;
			}
			$header .= $out;
		}
		
		$body = "";
		while (!feof($fp)) {
			$out = fgets ($fp,512);
			$body .= $out;
		}
		
		$idx = strpos(strtolower($header), "transfer-encoding: chunked");
		
		if ($idx > -1) { // chunk 데이터가 포함된 경우
			$temp = "";
			$offset = 0;
			do {
				$idx1 = strpos($body, "\r\n", $offset);
				$chunkLength = hexdec(substr($body, $offset, $idx1 - $offset));
				
				if ($chunkLength == 0) {
					break;
				} else {
					$temp .= substr($body, $idx1+2, $chunkLength);
					$offset = $idx1 + $chunkLength + 4;
				}
			} while(true);
			$body = $temp;
		}
		header("Content-Type: text/xml; charset=euc-kr");
		echo $body;
		fclose ($fp);
	}	
?>