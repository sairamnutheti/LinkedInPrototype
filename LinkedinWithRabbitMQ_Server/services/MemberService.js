/**
 * New node file
 */
var mysql = require('./dbConnectionsController');

function handle_request(msg, callback){	
	var res = {};
	if(msg.requestQueue=="displayconnections"){	

		var userid = msg.userid;

		if (userid !== undefined && userid !== "") {			
			/************** Create Connection******************************************/
			var connection=mysql.getConnection();
			/*************************************************************************/
			var query = connection.query("select CONCAT(user.firstName ,' ' ,user.lastName ) " +
					"as FullName ,user.userId from user as user inner join connections as conn on user.userId=conn.fromUserId " +
					"where connectionStatus=1 and flagConnection=0 and conn.toUserId= ? ", [userid ], function(err, rows) {					
				if (err) {
					res.error=err;									
				} 
				else {					
					res.code=200;	
					res.connections=rows;
				}		
				connection.end();
				callback(null, res);
			});
		}
		else{
			res.error="";
			callback(null,res);
		}
	}

	else if(msg.requestQueue=="displayinvitations"){	

		var userid = msg.userid;

		if (userid !== undefined && userid !== "") {			
			/************** Create Connection******************************************/
			var connection=mysql.getConnection();
			var query = connection.query("select CONCAT(user.firstName ,' ' ,user.lastName ) " +
					"as FullName,conn.idConnection from user as user inner join connections as conn on user.userId=conn.fromUserId " +
					"where connectionStatus=0 and flagConnection=0 and conn.toUserId= ? ", [userid ], function(err, rows) {			
				if (err) {
					res.error=err;									
				} 
				else {					
					res.code=200;	
					res.invitations=rows;
				}		
				connection.end();
				callback(null, res);
			});
		}
		else{
			res.error="";
			callback(null,res);
		}
	}


	else if(msg.requestQueue=="acceptinvitations"){			

		var idConnection=msg.idConnection;
		if (idConnection !== undefined && idConnection !== "") {			
			/************** Create Connection******************************************/
			var connection=mysql.getConnection();
			/*************************************************************************/	
			var query = connection.query("update connections set ? where idConnection=?",[{connectionStatus:1},idConnection],function(err, rows){ 		
				if (err) {
					res.error=err;									
				} 
				else {					
					res.code=200;	
				}
				connection.end();
				callback(null, res);
			});
		}
		else{
			res.error="";
			callback(null,res);
		}
	}

	else if(msg.requestQueue=="searchmember"){			

		var userid=msg.userid;
		var text=msg.text;
		if (idConnection !== undefined && idConnection !== "") {			
			/************** Create Connection******************************************/
			var connection=mysql.getConnection();
			/*************************************************************************/	
			var query = connection.query("select user.userId,CONCAT(user.firstName ,' ' ,user.lastName ) " +
					"as FullName, conn.idConnection from user as user left  outer join connections as conn on user.userId=conn.fromUserId where user.userId!=? and (first_name = ? or last_name=? or email_id=?)",
					[userid,text+"%",text+"%",text+"%"],function(err, rows){ 
				if (err) {
					res.error=err;									
				} 
				else {					
					res.code=200;	
					res.members=rows;
				}
				connection.end();
				callback(null, res);
			});
		}
		else{
			res.error="";
			callback(null,res);
		}
	}


	else if(msg.requestQueue=="sendinvitation"){			

		var userid=msg.userid;
		var fromUser=msg.fromUser;
		if (idConnection !== undefined && idConnection !== "") {			
			/************** Create Connection******************************************/
			var connection=mysql.getConnection();
			/*************************************************************************/	
			var data={idConnection:null,to_user_id:userid ,from_user_id:	fromUser}	;					
			var query = connection.query("INSERT INTO connections set ? ",data, function(err, rows){ 
				if (err) {
					res.error=err;									
				} 
				else {					
					res.code=200;	

				}
				connection.end();
				callback(null, res);
			});
		}
		else{
			res.error="";
			callback(null,res);
		}
	}
}