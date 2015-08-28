var amqp = require('amqp'), util = require('util');
var account = require('./services/AccountService');
var member=require('./services/MemberService');
var profile = require('./services/ProfileService');
var connection = amqp.createConnection({host:'127.0.0.1'});

connection.on('ready', function(){
	
	console.log("listening to Account Queue");
	connection.queue('_accountQueue', function(queue){
		queue.subscribe(function(message, headers, deliveryInfo, msgObject){
			///util.log(util.format( deliveryInfo.routingKey, message));
			//util.log("Message: "+JSON.stringify(message));
			//util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));			
			account.handle_request(message, function(err,res){	
					//util.log("errorno:",res.code);			
						connection.publish(msgObject.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8', 	
						correlationId:msgObject.correlationId
					});				
			});
		});
	});

	console.log("Listening to Member Queue");
	connection.queue('_memberQueue', function(queue){
		queue.subscribe(function(message, headers, deliveryInfo, msgObject){
			//util.log(util.format( deliveryInfo.routingKey, message));
			//util.log("Message: "+JSON.stringify(message));
			//util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			member.handle_request(message, function(err,res){				
				//return index sent
			
				connection.publish(msgObject.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:msgObject.correlationId
				});
			});
		});
	});

	console.log("Listening to Profile Queue");
	connection.queue('_profileQueue', function(queue){
		queue.subscribe(function(message, headers, deliveryInfo, msgObject){
			//util.log(util.format( deliveryInfo.routingKey, message));
			//util.log("Message: "+JSON.stringify(message));
			//util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));			
			profile.handle_request(message, function(err,res){		
				//util.log("error no:",res.code);
				connection.publish(msgObject.replyTo, res, {
					contentType:'application/json',
					contentEncodimsgObjectng:'utf-8',
					correlationId:msgObject.correlationId
				});
			});
		});
	}); 


}); //end of connection
