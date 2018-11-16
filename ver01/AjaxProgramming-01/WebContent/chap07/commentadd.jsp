<?xml version="1.0" encoding="euc-kr" ?>
<%@ page contentType="text/xml; charset=euc-kr" %>
<%@ page import = "java.sql.Connection" %>
<%@ page import = "java.sql.Statement" %>
<%@ page import = "java.sql.PreparedStatement" %>
<%@ page import = "java.sql.ResultSet" %>
<%@ page import = "java.sql.SQLException" %>
<%@ page import = "util.Util" %>
<%@ page import = "util.DB" %>
<%
	request.setCharacterEncoding("utf-8");
	String name = request.getParameter("name");
	String content = request.getParameter("content");

	Connection conn = null;
	Statement stmtIdSelect = null;
	ResultSet rsIdSelect = null;
	PreparedStatement pstmtIdUpdate = null;
	PreparedStatement pstmtCommentInsert = null;
	
	try {
		int nextId = 0;
		
		conn = DB.getConnection();
		conn.setAutoCommit(false);
		
		stmtIdSelect = conn.createStatement();
		rsIdSelect = stmtIdSelect.executeQuery(
			"select VALUE from ID_REPOSITORY where NAME='COMMENT'");
		if (rsIdSelect.next()) {
			nextId = rsIdSelect.getInt("VALUE");
		}
		nextId ++;
		
		pstmtIdUpdate = conn.prepareStatement(
			"update ID_REPOSITORY set VALUE = ? where NAME='COMMENT'");
		pstmtIdUpdate.setInt(1, nextId);
		pstmtIdUpdate.executeUpdate();
		
		pstmtCommentInsert = conn.prepareStatement(
			"insert into COMMENT values (?, ?, ?)");
		pstmtCommentInsert.setInt(1, nextId);
		pstmtCommentInsert.setString(2, name);
		pstmtCommentInsert.setString(3, content);
		pstmtCommentInsert.executeUpdate();
		
		conn.commit();
%>
<result>
	<code>success</code>
	<data><![CDATA[
	{
		id: <%= nextId %>,
		name: '<%= Util.toJS(name) %>',
		content: '<%= Util.toJS(content) %>'
	}
	]]></data>
</result>
<%
	} catch(Throwable e) {
		try { conn.rollback(); } catch(SQLException ex) {}
%>
<result>
	<code>error</code>
	<message><![CDATA[<%= e.getMessage() %>]]></message>
</result>
<%
	} finally {
		if (rsIdSelect != null) 
			try { rsIdSelect.close(); } catch(SQLException ex) {}
		if (stmtIdSelect != null) 
			try { stmtIdSelect.close(); } catch(SQLException ex) {}
		if (pstmtIdUpdate != null) 
			try { pstmtIdUpdate.close(); } catch(SQLException ex) {}
		if (pstmtCommentInsert != null) 
			try { pstmtCommentInsert.close(); } catch(SQLException ex) {}
		if (conn != null) try {
			conn.setAutoCommit(true);
			conn.close();
		} catch(SQLException ex) {}
	}
%>
