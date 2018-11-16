<%@ page contentType = "text/plain; charset=euc-kr" %>
<%
	request.setCharacterEncoding("utf-8");
	String value = request.getParameter("value");
	String type = request.getParameter("type");
	
	if (value.equals("001")) {
%>
[
	{text: "备肺备", value: "001001"},
	{text: "包厩备", value: "001002"},
	{text: "辑措巩备", value: "001003"}
]
<%
	} else if (value.equals("002")) {
%>
[
	{text: "巢悼备", value: "002001"},
	{text: "何乞备", value: "002002"},
	{text: "拌剧备", value: "002003"}
]
<%
	} else if (value.equals("003")) {
%>
[
	{text: "辑备", value: "003001"},
	{text: "蜡己备", value: "003002"},
	{text: "措傣备", value: "003003"}
]
<%
	}
%>