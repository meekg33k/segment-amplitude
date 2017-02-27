'use strict';

var moment = require('moment');
var request = require('request');
const endpoint = 'https://api.amplitude.com/httpapi';

/** Global function for sending event to Amplitude**/
function sendEvent(event, apikey, callback){

	request.post(endpoint+'?api_key='+apikey+'&event='+event, 
		(err, res, body) => {
        	if (err)
        		callback(err);
            else 
            	callback(null, res);
    });
} 

/** Amplitude-Integration Object **/
var Amplitude = function(){

	/** Variables for Error 503 retries **/
	this.count = 0;
	this.id = 0;

	this.errorCodes = {
		"missing argument api_key": {
			"status": 403,
			"message": "No Amplitude API Key provided"
		},
		"invalid api_key": {
			"status": 403,
			"message": "Invalid Amplitude API Key"
		},
		"missing argument event": {
			"status": 400,
			"message": "No Event Params provided"
		},
		"invalid event json": {
			"status": 400,
			"message": "Invalid Event Format"
		}
	};
}

Amplitude.prototype.getError = function (msg, eventId){

	if (this.errorCodes[msg]){
		var errorObj = this.errorCodes[msg];
		errorObj.eventId = eventId;
	}
	else{
		var errorObj = {
			"message": msg,
			"eventId": eventId
		}
	}
	return errorObj;
}

Amplitude.prototype.emitEvent = function(e, cb){

    if (e){
    	this.event = e;
    }
    var self = this;

    this.callback = function(err, res){
	    //Clear interval from previous retries
	    if (self.id){
	    	clearInterval(self.id);
	    	self.id = undefined;
	    }

    	if (err){
    		//This shouldn't happen but... if it does, it's our error **/
            cb(err);
        }
        else {
        	if (res.statusCode == 503){
        		/** Retries **/
        		if (self.count == 10){
        			self.count = 0; //Reset count
    			    clearInterval(self.id);
        			cb({"status": 503}, null); //Trigger error
        		}
        		else{
        			if (!self.id){
        				self.count++;
        				console.log("Retrying.... "+self.count);
        				self.id = setInterval(sendEvent.bind(null, self.event, self.api_key, self.callback), 3000);
        			}
        		}
            }
            else{
	            cb(null, res);
            }
        }
    }
    //Send event to Amplitude's HTTP API endpoint
    sendEvent(e, this.api_key, this.callback);
};

Amplitude.prototype.parseEvent = function(event){

	var convertedEvent = {};
	var user_properties;

	if (event.email){
		convertedEvent.user_id = event.email;
	}

	if (event.username){
		user_properties = {};
		user_properties.username = event.username;
	}

	if (event.userId){
		if (!user_properties){
			user_properties = {};
		}
		user_properties.userId = event.userId;
	}

	convertedEvent.device_id = event.email || event.context.device.id ;
	convertedEvent.event_type = event.type;
	convertedEvent.time = moment(event.timestamp).unix().valueOf();
	//convertedEvent.event_properties = JSON.stringify(event.context);
	if (user_properties){
		convertedEvent.user_properties = user_properties;
	}
	convertedEvent.app_version = event.context.library.version;
	convertedEvent.platform = event.context.device.type;
	convertedEvent.os_name = event.context.os.name;
	convertedEvent.device_brand = event.context.device.model;
	convertedEvent.device_manufacturer = event.context.device.manufacturer;
	convertedEvent.device_model = event.context.device.model;
	convertedEvent.carrier = event.context.network.carrier;
	convertedEvent.country = event.context.location.country;
	convertedEvent.city = event.context.location.city;
	convertedEvent.dma = event.context.location.city;
	convertedEvent.language = event.context.locale; 
	convertedEvent.location_lat = event.context.location.latitude;
	convertedEvent.location_lng = event.context.location.longitude;
	convertedEvent.ip = event.context.ip;
	convertedEvent.idfa = event.context.device.id; 
	convertedEvent.adid = event.context.device.id; 
	convertedEvent.insert_id = event.id || event.messageId;

	this.event = convertedEvent;

	return convertedEvent;
};

Amplitude.prototype.passUserAPIKey = function(apiKey){
	this.api_key = apiKey;
	return this;
};

module.exports = Amplitude;