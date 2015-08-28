var ejs = require("ejs");
var express = require('express');
var mysql = require('./dbConnectionsController');
var querystring = require('querystring');
var cstmError = require('./errorController');
var reqHandler= require('../rpc/RequestHandler');

/*
 * To Encrypt Password with Salt * 
 * 
 * 
function encryptPassword(pwd)
{
	//var bcrypt = require('bcryptjs');
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pwd, salt);	
	return hash;
}*/

/***
 * 
 * Add Users to database
 * 
 * 
 * */
exports.addUser=function(req,res){		
	var firstname=req.param("firstname"),lastname=req.param("lastname");
	var email=req.param("emailid"),password=req.param("password");
	if((firstname!==undefined && password !==undefined && lastname!==undefined && email !==undefined) && (firstname!=="" && password !=="" && lastname!=="" && email !=="") )  
	{
		//var encpassword=encryptPassword(password);
		var msg_payload={				
				"firstname":firstname,
				"lastname":lastname,
				"email":email,
				"password":password,
				requestQueue:"signup"
		};				
		reqHandler.makeRequest('_accountQueue',msg_payload, function(err,results){			

			if(err){
				console.log(err);
				res.send(err);
			}
			else 
			{	
				if(results.error)
				{
					res.send(results.error);
					//throw new Error(res.Error);
				}
				else{
					//console.log("error "+results.error);
					res.send({'msg':'You Signed Up Successfully'});	
				}
			}  
		});	
	}
	else {
		cstmError.throwException('Please fill all the manidatory fields', res);
	}
};


exports.signout=function(req,res){		
	req.session.destroy(function(){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
		res.redirect('/');
	});

};

exports.authValidate = function(req, res) {
	var pwd=req.param("pswd");	
	var email=req.param("email");

	if ((pwd !== undefined && email !== undefined) && (pwd !== "" && email !== "")) 
	{		
		var msg_payload={								
				"email":email,
				"password":pwd,
				requestQueue:"login"
		};				
		reqHandler.makeRequest('_accountQueue',msg_payload, function(err,resData){
			if(err){					
				res.send(resData.error);	
			}
			else{	

				if(resData.error)
				{
					res.render('index',{"error":resData.error});

				}
				else if(resData.code==200){						
					req.session.loginStatus=true;
					req.session.username=resData.fullName;
					req.session.userid=resData.userid;			
					res.redirect('/home');
				}
			}
		});		
	}
	else{
		res.redirect("/");
	}
};

/*
function getProfileDetails(req,res){
	//console.log("in");
res.render('home',{session:req.session});
}
 */



exports.loadProfile = function(req, res){	

	if(req.session.loginStatus===true)
	{				
		var msg_payload={		
				"userid":req.session.userid,
				requestQueue:"profile"
		};				
		reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
			if(err){
				res.render('index',{"error":err});
			}
			else{	
				console.log("ss"+resData.code);
				if(resData.error)
				{
					res.render('index',{"error":resData.error});
				}
				else if(resData.code==200){	

					var profileData=resData.profileData;
					res.render('home',{session:req.session,"summary":profileData.summary,"education":profileData.education,"experience":profileData.experience,"skills":profileData.skills});
				}
			}
		});		

	}
	else{	
		res.redirect('/');	

	}
};

exports.updatesummary = function(req, res){	

	if(req.session.loginStatus===true)
	{					
		var userid=req.session.userid;
		var summary=req.param("summary");			
		if (userid !== undefined && userid !== "") {

			var msg_payload={		
					"userid":req.session.userid,
					summary:summary,
					requestQueue:"updatesummary"
			};		
			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{	
					//console.log("ss"+resData.code);
					if(resData.error)
					{
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});				
		} else {
			res.send("Session Expired");		
		}
	}
	else{	
		res.redirect('/');	
	}
};


exports.addEducation = function(req, res) {

	if(req.session.loginStatus===true)
	{		
		var level = req.param("level") === undefined ? null : req.param("level");
		var univname = req.param("univname");
		var field = req.param("field") === undefined ? null : req.param("field"); 
		var grade = req.param("grade") === undefined ? null : req.param("grade"); // not
		//var strDate = req.param("startdate"), endDate = req.param("enddate");
		var strDate=req.param("startdate")===undefined?null:(req.param("startdate"));
		var endDate=req.param("enddate")===undefined?null:(req.param("enddate"));
		var description = req.param("description") === undefined ? null : req
				.param("description"); 
		var userid = req.session.userid;

		if ((univname !== undefined && userid !== undefined )&& (univname !== "" && userid !== "" )) {

			var msg_payload={
					level : level,
					univName : univname,
					field : field,
					grade : grade,
					startDate :strDate,
					endDate :endDate,
					description : description,
					userId : userid,
					requestQueue:"addeducation"
			};


			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});		

		}

		else {
			res.send({error:'Please fill all the manidatory fields'});			
		}
	}
	else{
		res.redirect('/');	

	}
};


exports.updateeducation=function(req, res){

	var level=req.param("level")===undefined?null:req.param("level");
	var univname=req.param("univname");
	var field=req.param("field")===undefined?null:req.param("field");
	var grade=req.param("grade")===undefined?null:req.param("grade"); 
	var strDate=req.param("startdate")===undefined?null:(req.param("startdate"));
	var endDate=req.param("enddate")===undefined?null:(req.param("enddate"));
	var description=req.param("description")===undefined ?null:req.param("description"); 
	var userid=req.session.userid;
	var idEducation=req.param("ideducation");
	if(req.session.loginStatus===true)
	{	

		if((univname!==undefined && idEducation!==undefined) && (univname!==""  && idEducation!=="") )  
		{						  

			var msg_payload={
					level : level,
					univName : univname,
					field : field,
					grade : grade,
					strDate :strDate,
					endDate :endDate,
					description : description,
					idEducation : idEducation,
					requestQueue:"updateeducation"
			};

			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{					
					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});	
		}			

	}
	else{	
		res.redirect('/');		
	}
};


exports.getEducationById = function(req, res){

	if(req.session.loginStatus===true)
	{	
		//console.log("idexp");
		var idedu=req.param("ideducation");	
		//console.log("idedu: "+idexp);
		if (idedu !== undefined && idedu !== "") {


			var msg_payload={			
					idEducation:idedu,
					requestQueue:"education"
			};

			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"education":resData.education});
					}
				}
			});	
		} else {
			res.redirect("/home");		
		}

	}
	else{	
		res.redirect('/');			
	}
};


exports.addExperience = function(req, res) {

	if(req.session.loginStatus===true)
	{	

		var company = req.param("companyname"); 				
		var title = req.param("title"); 
		var location = req.param("location") === undefined ? null : req.param("location"); 
		//var strDate = req.param("startdate"), endDate = req.param("enddate");
		var strDate=req.param("startdate")===undefined ? null:(req.param("startdate"));
		var endDate=req.param("enddate")===undefined ? null:(req.param("enddate"));
		var desc = req.param("description") === undefined ? null : req.param("description"); 
		var userid = req.session.userid;

		if ((company !== undefined && title !== undefined && strDate !== undefined && userid !== undefined)	&& (company !== "" && title !== "" )) {
			var msg_payload={					
					companyName : company,					
					title : title,
					location : location,
					startDate :strDate,
					endDate :endDate,
					description : desc,
					userId : userid,
					requestQueue:"addexperience"
			};
			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});		

		} 
		else {
			res.send({error:'Please fill all the manidatory fields'});	
		}			
	}				
	else{

		res.redirect('/');
	}
};





exports.getExperienceById = function(req, res){

	if(req.session.loginStatus===true)
	{	
		var idexperience=req.param("idexperience");		
		if (idexperience !== undefined && idexperience !== "") {
			var msg_payload={			
					idExperience:idexperience,
					requestQueue:"experience"
			};

			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});      
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"experience":resData.experience});
					}
				}
			});	


		} else {
			res.redirect("/home");		
		}

	}
	else{	
		res.redirect('/');			
	}
};



exports.updateexperience=function(req, res){	

	if(req.session.loginStatus===true)
	{								
		var userid=req.session.userid;
		var companyname=req.param("companyname"); 
		var title=req.param("title"); 
		var location=req.param("location")===undefined?null:req.param("location"); 
		//var startdate=req.param("startdate"),enddate=req.param("enddate");
		var startdate=req.param("startdate")===undefined ? null:req.param("startdate");
		var enddate=req.param("enddate")===undefined ? null:req.param("enddate");
		var description=req.param("description")===undefined ?null:req.param("description"); 
		var expid=req.param("idExperience");
		if ((companyname !== undefined && title !== undefined && startdate !== undefined && expid!== undefined )	&& (companyname !== "" && title !== "" )) {
			var msg_payload={					
					companyName : companyname,					
					title : title,
					location : location,
					startDate :startdate,
					endDate :enddate,
					description : description,
					idExperience:expid,
					requestQueue:"updateexperience"
			};		
			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});	
		}
		else{
			res.send({error:'Please fill all the manidatory fields'});	
		}
	}
	else{	
		res.redirect('/');		
	}
};


exports.addSkill = function(req, res) {
	if(req.session.loginStatus===true)
	{	var skillName = req.param("skillName");
	var userid = req.session.userid;
	if ((skillName !== undefined && userid !== undefined)	&& (skillName !== "" )) {
		var msg_payload = {					
				skillName : skillName,
				userId : userid,
				requestQueue:"addskill"
		};
		reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
			if(err){
				res.send({"error":err});
			}
			else{							
				if(resData.error){
					res.send({"error":resData.error});
				}
				else if(resData.code==200){		
					res.send({"status":"success"});
				}
			}
		});		

	} 
	else {
		res.send({error:'Please fill all the manidatory fields'});	
	}			
	}				
	else{
		res.redirect('/');
	}
};


exports.updateSkill=function(req, res){	

	if(req.session.loginStatus===true)
	{								
		var userid=req.session.userid;
		var skillName = req.param("skillName");
		var idSkills=req.param('idSkills');		
		var userid = req.session.userid;
		if ((skillName !== undefined && userid !== undefined)	&& (skillName !== "" )) {		
			var msg_payload = {					
					skillName : skillName,
					idSkills : idSkills,
					requestQueue:"updateskill"
			};		
			reqHandler.makeRequest('_profileQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.send({"status":"success"});
					}
				}
			});		
		}
		else{
			res.send({error:'Please fill all the manidatory fields'});	
		}
	}
	else{	
		res.redirect('/');		
	}
};
/*
exports.connections = function(req, res){
	  res.render('connections', { title: 'Express' });
	};


 */

exports.connections= function(req, res){
	if(req.session.loginStatus===true)
	{	
		var userid=req.session.userid;
		if (userid !== undefined && userid !== "") {

			var msg_payload = {					
					requestQueue:"displayconnections"
			};		
			reqHandler.makeRequest('_memberQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.render('connections',{"connections":resData.connections});
					}
				}
			});		


		} else {
			res.redirect("/home");		
		}

	}
	else{	
		res.redirect('/');			
	}
};



exports.invitations= function(req, res){
	if(req.session.loginStatus===true)
	{	
		var userid=req.session.userid;
		if (userid !== undefined && userid !== "") {
			var msg_payload = {					
					requestQueue:"displayinvitations"
			};		
			reqHandler.makeRequest('_memberQueue',msg_payload, function(err,resData){
				if(err){
					res.send({"error":err});
				}
				else{

					if(resData.error){
						res.send({"error":resData.error});
					}
					else if(resData.code==200){		
						res.render('invitations',{"invitations":resData.invitations});
					}
				}
			});

		} else {
			res.redirect("/home");		
		}

	}
	else{	
		res.redirect('/');			
	}
};


exports.acceptinvitations= function(req, res){
	if(req.session.loginStatus===true)
	{		var idConnection=req.param("idConnection");		
	var userid=req.session.userid;
	if (userid !== undefined && userid !== "") {
		var msg_payload = {					
				requestQueue:"acceptinvitations",
				idConnection:idConnection
		};		
		reqHandler.makeRequest('_memberQueue',msg_payload, function(err,resData){
			if(err){
				res.send({"error":err});
			}
			else{

				if(resData.error){
					res.send({"error":resData.error});
				}
				else if(resData.code==200){		
					res.send({"status":"success"});
				}
			}
		});

	} else {
		res.redirect("/home");		
	}

	}
	else{	
		res.redirect('/');			
	}
};




exports.searchmember= function(req, res){
	if(req.session.loginStatus===true)
	{		var userid=req.param("idConnection");
	var text=req.param("enteredText");
	if (userid !== undefined && userid !== "") {
		var msg_payload = {					
				requestQueue:"searchmember",
				userid:userid,
				text:text,
		};		
		reqHandler.makeRequest('_memberQueue',msg_payload, function(err,resData){
			if(err){
				res.send({"error":err});
			}
			else{

				if(resData.error){
					res.send({"error":resData.error});
				}
				else if(resData.code==200){		
					res.render('members',{"members":members});
				}
			}
		});

	} else {
		res.redirect("/home");		
	}

	}
	else{	
		res.redirect('/');			
	}
};


exports.showsearch = function(req, res){
	res.render('search', { title: 'Express' });
};

exports.sendinvitation= function(req, res){

	if(req.session.loginStatus===true)
	{	var fromUser = req.param("fromUser");
	var userid = req.session.userid;
	if ((fromUser !== undefined && userid !== undefined)	&& (fromUser !== "" )) {


		/************** Create Connection******************************************/
		var connection=mysql.getConnection();
		/*************************************************************************/	
		var data={idConnection:null,to_user_id:userid ,from_user_id:	fromUser}	;					
		var query = connection.query("INSERT INTO connections set ? ",data, function(err, rows){  
			if (err) {
				console.log(err);
				cstmError.mySqlException(err, res);
			} else {
				res.send({
					"status" : "success"
				});
			}

			/*mysql.returnDBconn(dbConn);*/
		});
	} 
	else {
		cstmError.throwException('Please fill all the manidatory fields', res);
	}			
	}				
	else{

		res.redirect('/');
	}

};