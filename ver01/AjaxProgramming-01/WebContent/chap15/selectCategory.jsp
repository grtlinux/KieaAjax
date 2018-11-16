<%@ page contentType = "text/plain; charset=euc-kr" %>
<%
	request.setCharacterEncoding("utf-8");
	String value = request.getParameter("value");
	String parent = request.getParameter("parent");
	
	System.out.println("v:"+value);
	System.out.println("p:"+parent);
	
	if (parent.equals("category1")) {
		if (value.equals("001")) {
%>
	[
		{text: "LG XNOTE", value: "001001"},
		{text: "삼성 SENS", value: "001002"}
	]
<%
		} else if (value.equals("002")) {
%>
	[
		{text: "삼성", value: "002001"},
		{text: "LG 전자", value: "002002"}
	]
<%
		}
	} else if (parent.equals("category2")) {
		if (value.equals("001001")) {
%>
	[
		{text: "XNOTE LW20", value: "001001001"},
		{text: "X-NOTE LW40-PLUS", value: "001001002"}
	]
<%
		} else if (value.equals("001002")) {
%>
	[
		{text: "센스 NT-Q35/C161", value: "001002001"},
		{text: "센스 NT-X06/C17D", value: "001002002"}
	]
<%
		} else if (value.equals("002001")) {
%>
	[
		{text: "매직스테이션 DM-Z48/E304", value: "002001001"},
		{text: "매직스테이션 DM-T50/V300", value: "002001002"}
	]
<%
		} else if (value.equals("002002")) {
%>
	[
		{text: "AV Center DV50K-PM601", value: "002002001"},
		{text: "LG전자 X270A", value: "002002002"}
	]
<%
		}
	}
%>