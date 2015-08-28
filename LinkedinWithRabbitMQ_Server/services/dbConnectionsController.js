var ejs= require('ejs');
var mysql = require('mysql');



function getConnection(){	
	var connection=mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'test'
	});
	return connection;
}

exports.getConnection=getConnection;