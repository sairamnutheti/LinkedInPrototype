/**
 * New node file
 */
var mysql = require('./dbConnectionsController');
var bcrypt = require('./bCrypt');
//var querystring = require('querystring');
//var cstmError = require('./errorController');


/*
 * To Encrypt Password with Salt * 
 * 
 * */
function encryptPassword(pwd)
{
	//var bcrypt = require('bcryptjs');
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pwd, salt);	
	return hash;
}

function handle_request(msg, callback){	

	var res = {};
	/***************************************SignUP ****************************************************** */

	if(msg.requestQueue==="signup"){
		var encpassword=encryptPassword(msg.password);
		var userDetails={
				userId:null,
				firstName:msg.firstname,
				lastName:msg.lastname,
				emailId:msg.email,
				password:encpassword,
				dateOfCreation: new Date(),
				dateOfUpdation: null,
				lastLoginDate:null		
		};
		/************** Create Connection******************************************/
		var connection=mysql.getConnection();
		/*************************************************************************/
		var query =connection.query("INSERT INTO USER SET ? ",userDetails, function(err, rows)
				{ 
			/************** End Connection******************************************/	
			connection.end();
			/*************************************************************************/		
			if(err){				
				//throw new Error("User Already Exists");	
				//callback(new Error("User Already Exists!!"),null)
				res.error="User Already Exists!!";
			}
			else{
				//res.code({'msg':'You Signed Up Successfully'});	
				res.code='200';	
			}	
			callback(null, res);	
				});   

	}
	/*************************************************************Login Validation******************************************************************************/	
	if(msg.requestQueue==="login"){

		var email=msg.email,password=msg.password
		/************** Create Connection******************************************/
		var connection=mysql.getConnection();
		/*************************************************************************/
		var querys = mysql.getConnection().query("select * from user where emailId=? ",email, function(err, rows){	 			
			if(err){
				console.log(err);
				res.error=err;	
			}
			else if(rows.length>0){	 
				if(bcrypt.compareSync(password, rows[0].password.toString()))
				{
					/*	req.session.loginStatus=true;*/
					var fullName=(rows[0].firstName).toString().toUpperCase()+" "+(rows[0].lastName).toString().toUpperCase();
					/*req.session.userid=rows[0].userId;	*/	
					userId=rows[0].userId;
					var data={lastLoginDate:new Date()}	;
					/**************************** Update Last Login Time ******************************/
					connection.query("Update user set ? where userId=? ",[data,rows[0].userId], function(err, rows){    	  
						if(err){							
							res.error=err;
						}
						else{
							/*res.send({"Status":"Success"});*/
							//req.session.lastlogin=new Date();							
							//res.redirect('/home');							
							res.fullName=fullName;
							res.userid=userId;
							res.code="200";
							res.lastlogin=new Date();			
						}	
						/************** End Connection******************************************/	
						connection.end();							
						callback(null, res);	
						/*************************************************************************/			
					});
					/*******************************************************************************/				
				}
				else{
					res.error="Invalid Credentials";
					callback(null, res);		
				}
			}
			else{
				res.error="Invalid User";
				callback(null, res);	
			}


		});
	}
	/***********************************************************************************************************************************************************/
}

exports.handle_request = handle_request;