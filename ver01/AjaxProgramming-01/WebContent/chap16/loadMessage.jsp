<?xml version="1.0" encoding="euc-kr" ?>
<%@ page contentType = "text/xml; charset=euc-kr" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.List" %>
<%@ page import = "util.DB" %>
<%@ page import = "util.Util" %>
<%
	request.setCharacterEncoding("utf-8");
	int lastMsgId = Integer.parseInt(request.getParameter("lastMsgId"));
	List messageList = new java.util.ArrayList();
	
	Connection conn = null;
	Statement stmt = null;
	ResultSet rs = null;
	
	int newLastMsgId = 0;
	
	boolean isSuccess = true;
	
	try {
		conn = DB.getConnection();
		stmt = conn.createStatement();
		
		if (lastMsgId == 0) {
			rs = stmt.executeQuery("select max(MESSAGE_ID) from CHAT_MESSAGE");
			if (rs.next()) {
				newLastMsgId = rs.getInt(1);
			}
		} else {
			rs = stmt.executeQuery("select * from CHAT_MESSAGE "+
			    "where MESSAGE_ID > "+lastMsgId + " order by MESSAGE_ID asc");
			while(rs.next()) {
				messageList.add(rs.getString("MESSAGE"));
				newLastMsgId = rs.getInt("MESSAGE_ID");
			}
		}
	} catch(SQLException ex) {
		isSuccess = false;
	} finally {
		if (rs != null) try { rs.close(); } catch(SQLException ex) {}
		if (stmt != null) try { stmt.close(); } catch(SQLException ex) {}
		if (conn != null) try { conn.close(); } catch(SQLException ex) {}
	}
%>
<result>
	<code><%= isSuccess ? "success" : "fail" %></code>
	<%	if (isSuccess) { %>
	<lastMsgId><%= newLastMsgId %></lastMsgId>
	<messages>
	<%		for (int i = 0 ; i < messageList.size() ; i++) { %>
		<message><![CDATA[<%= Util.toJS((String)messageList.get(i)) %>]]></message>
	<%		} %>
	</messages>
	<%	} %>
</result>