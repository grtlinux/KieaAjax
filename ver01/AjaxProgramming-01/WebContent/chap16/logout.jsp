<?xml version="1.0" encoding="euc-kr" ?>
<%@ page contentType = "text/xml; charset=euc-kr" %>
<%
	request.setCharacterEncoding("utf-8");
	String nickName = request.getParameter("nickName");
%>
<result>
	<code>success</code>
	<nickName><%= nickName %></nickName>
</result>