/**
 * New node file
 */
var mysql = require('./dbConnectionsController');
var profile = require('../utilities/profile');
function handle_request(msg, callback){	
	var res = {};

	/*************************************************************************** Load profile ***************************************************************************************************************************** */
	if(msg.requestQueue=="profile"){	
		//console.log("inside");
		var userid = msg.userid;
		if (userid !== undefined && userid !== "") {			
			profile.getProfileById( function(err, result) {
				if(err){
					res.error=err;
				}		           
				else{
					res.code="200";
					res.profileData=result;			           
				}		        
				callback(null, res);
			},userid);
		}			
	}
	else if(msg.requestQueue=="updatesummary")
	{
		var userid = msg.userid;
		var summary=msg.summary;
		if (userid !== undefined && userid !== "") {			
			var connection=mysql.getConnection();			
			var query = connection.query("update user set ? where userId=?", [ {summary : summary}, userid ], function(err, rows) {						
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
			res.error="Please add summary";
			callback(null,res);
		}
	}

	else if(msg.requestQueue=="addeducation"){

		var level=msg.level;
		var univName = msg.univName;
		var field = msg.field;
		var grade = msg.grade;
		//var strDate = req.param("startdate"), endDate = req.param("enddate");
		var strDate=msg.strDate;
		var endDate=msg.endDate;
		var description = msg.description;
		var userId = msg.userId;		
		var data = {
				idEducation : null,
				level : level,
				univName : univName,
				field : field,
				grade : grade,
				startDate :strDate,
				endDate :endDate,
				description : description,
				userId : userId
		};			
		var connection=mysql.getConnection();		
		var query = connection.query("INSERT INTO education set ? ", data,function(err, rows) {				
			if (err) {			
				//console.log(err);
				res.error=err;			
			} 
			else {
				if (rows.affectedRows > 0){

					res.code=200;	
				}
				else{
					res.error='Invalid User ID';
				}
			}
			connection.end();	
			callback(null,res);				
		});

	}

	else if(msg.requestQueue=="updateeducation"){

		var level=msg.level;
		var univName = msg.univName;
		var field = msg.field;
		var grade = msg.grade;
		//var strDate = req.param("startdate"), endDate = req.param("enddate");
		var strDate=msg.strDate;
		var endDate=msg.endDate;
		var desc = msg.description;
		var idEducation = msg.idEducation;		
		console.log("ins"+level+","+univName+","+field+","+grade+","+endDate+","+desc+strDate+","+idEducation);		
		var connection=mysql.getConnection();		
		var query = connection.query("Update education set ? where idEducation=? ",[{level:level,univName:univName,field:field,
			grade:grade,description:desc,startDate:strDate,endDate:endDate},idEducation], function(err, rows){  		
			if (err) {			
				console.log(err);
				res.error=err;			
			} 
			else {

				res.code=200;					
			}
			connection.end();	
			callback(null,res);				
		});

	}

	else if(msg.requestQueue=="education"){

		var idEducation = msg.idEducation;	
		var connection=mysql.getConnection();	
		var query = connection.query("select * from education where idEducation=? ", [idEducation ], function(err, rows) {
			if (err) {			
				//console.log(err);
				res.error=err;			
			} 
			else {
				res.code=200;	
				res.education=rows[0];
			}
			connection.end();	
			callback(null,res);				
		});

	}

	else if(msg.requestQueue=="addexperience"){

		var companyName=msg.companyName;
		var title = msg.title;
		var location = msg.location;		
		var startDate=msg.startDate;
		var endDate=msg.endDate;
		var description = msg.description;
		var userId = msg.userId;	

		var data = {
				idExperience : null,
				companyName : companyName,
				userId : userId,
				title : title,
				location : location,
				startDate :startDate,
				endDate :endDate,
				description : description
		};	
		var connection=mysql.getConnection();
		var query = connection.query("INSERT INTO experience set ? ", data,	function(err, rows) {		
			if (err) {			
				//console.log(err);
				res.error=err;			
			} 
			else {
				if (rows.affectedRows > 0){
					console.log("");
					res.code=200;	
				}
				else{
					res.error='Invalid User ID';
				}
			}
			connection.end();	
			callback(null,res);				
		});

	}

	else if(msg.requestQueue=="experience"){			
		var idExperience = msg.idExperience;	
		var connection=mysql.getConnection();	
		var query = connection.query("select * from experience where idExperience=? ", [idExperience ], function(err, rows) {
			if (err) {			
				//console.log(err);
				res.error=err;			
			} 
			else {
				res.code=200;	
				res.experience=rows[0];
			}
			connection.end();	
			callback(null,res);				
		});

	}


	else if(msg.requestQueue=="updateexperience"){

		var companyName=msg.companyName;
		var title = msg.title;
		var location = msg.location;		
		var startDate=msg.startDate;
		var endDate=msg.endDate;
		var description = msg.description;			
		var idExperience = msg.idExperience;	

		var connection=mysql.getConnection();			
		var query = connection.query("update experience set ? where idExperience=?",[{companyName:companyName,title:title,
			location:location,description:description,startDate:startDate,endDate:endDate},idExperience],function(err, rows){ 		
			if (err) {			
				console.log(err);
				res.error=err;			
			} 
			else {
				console.log("d");
				res.code=200;					
			}
			connection.end();	
			callback(null,res);				
		});

	}


	else if(msg.requestQueue=="addskill"){			

		var skillName = msg.skillName;			
		var userId = msg.userId;	

		var data = {
				idSkills : null,
				skillName : skillName,
				userId : userId					
		};
		var connection=mysql.getConnection();
		var query = connection.query("INSERT INTO skills set ? ", data,	function(err, rows) {	
			if (err) {							
				res.error=err;			
			} 
			else {
				if (rows.affectedRows > 0){
					console.log("d");
					res.code=200;	
				}
				else{
					res.error='Invalid User ID';
				}
			}
			connection.end();	
			callback(null,res);				
		});

	}


	else if(msg.requestQueue=="updateskill"){

		var skillName=msg. skillName;
		var idSkills=msg.idSkills;			
		var connection=mysql.getConnection();			
		var query = connection.query("update skills set ? where idSkills=?",[{skillName:skillName},idSkills],function(err, rows){ 			
			if (err) {			
				console.log(err);
				res.error=err;			
			} 
			else {

				res.code=200;					
			}
			connection.end();	
			callback(null,res);				
		});

	}

	/***********************************************************************************************************************************************************************************8 */
}
exports.handle_request = handle_request;