/**
 * New node file
 */
var mysql = require('../services/dbConnectionsController');

function getProfileById(callback,userid)
{
	/************** Create Connection******************************************/
	var connection=mysql.getConnection();	
	var experience="",education="",skills="",summary;	
	var query =connection.query("select summary from user where userId=?",[ userid ], function(err, smry) {				
		if(err){	
			callback(err);
		}	
		summary=smry[0].summary;
			connection.query("select * from experience where userId=? order by startDate desc",[ userid ], function(err, exp) {				
				if(err){	
					callback(err);
				}	
				experience=exp;
				connection.query("select * from education where userId=? order by startDate desc ",[ userid ], function(err, edu) {				
						if(err){	
							callback(err);
						}	
				education=edu;	
					connection.query("select * from skills where userId=? ",[ userid ], function(err, skls) {				
						if(err){	
								callback(err);
						}
					skills=skls;					
					callback(null,{"summary":summary,"experience":experience,"education":education,"skills":skills});
					connection.end();
					});
				});
			});
		/*else{
			callback(null,rows[0].summary);			
		}	*/	
				
	});   
}

exports.getProfileById=getProfileById;