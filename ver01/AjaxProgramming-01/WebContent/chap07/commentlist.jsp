<?xml version="1.0" encoding="euc-kr" ?>
<%@ page contentType="text/xml; charset=euc-kr" %>
<%@ page import = "java.sql.Connection" %>
<%@ page import = "java.sql.Statement" %>
<%@ page import = "java.sql.ResultSet" %>
<%@ page import = "java.sql.SQLException" %>
<%@ page import = "util.Util" %>
<%@ page import = "util.DB" %>
<%
	Connection conn = null;
	Statement stmt = null;
	ResultSet rs = null;
	try {
		conn = DB.getConnection();
		stmt = conn.createStatement();
		rs = stmt.executeQuery("select * from COMMENT order by ID");
%>
<result>
	<code>success</code>
	<data><![CDATA[
	[
<%
		if (rs.next()) {
			do {
				if (rs.getRow() > 1) { %>
		,
<%
				}
%>
		{
			id: <%= rs.getInt("ID") %>,
			name: '<%= Util.toJS(rs.getString("NAME")) %>',
			content: '<%= Util.toJS(rs.getString("CONTENT")) %>'
		}
<%
			} while(rs.next());
		}
%>
	]
	]]></data>
</result>
<%	} catch(Throwable e) {
		out.clearBuffer();
 %>
<result>
	<code>error</code>
	<message><![CDATA[<%= e.getMessage() %>]]></message>
</result>
<%	} finally {
		if (rs != null) try { rs.close(); } catch(SQLException ex) {}
		if (stmt != null) try { stmt.close(); } catch(SQLException ex) {}
		if (conn != null) try { conn.close(); } catch(SQLException ex) {}
	}
%>
