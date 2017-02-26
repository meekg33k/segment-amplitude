'use strict';

var moment = require('moment');
var request = require('request');

var amplitude = {};
var APIKEY;

/** Global variables for retries after Error 503 **/
var count = 0;
var cb;
var event;
var id;


amplitude.endpoint = 'https://api.amplitude.com/httpapi';
amplitude.errorCodes = {
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

amplitude.emitEvent = function(e, callback){

    //Clear interval from previous retries
    clearInterval(id);
    id = undefined;

    if (callback){
    	cb = callback;
    }

    if (e){
    	event = e;
    }

    /*count++;
    console.log("Call "+count);*/


    // Make a call to Amplitude's HTTP API endpoint
    request.post(amplitude.endpoint+'?api_key='+APIKEY+'&event='+event, 
    //request.post(amplitude.endpoint+'?api_key='+APIKEY+'&event=[{"user_id":"john_doe@gmail.com", "event_type":"watch_tutorial", "user_properties":{"Cohort":"Test A"}, "country":"United States", "ip":"127.0.0.1", "time":1396381378123}]', 
        function (err, res, body) {

        	if (err){
        		/** This shouldn't happen but... if it does, it's usually from our end **/
                cb(err);
            }
            else {
            	 
	        	if (res.statusCode == 400){
	        		/** Retries **/
	        		if (count == 10){
	        			count = 0; //Reset count
        			    clearInterval(id);
	        			cb(true, null); //Trigger error
	        		}
	        		else{
	        			if (!id){
		                    id = setInterval(amplitude.emitEvent, 1000);
		                }
	        		}
	            }
	            else{
		            cb(null, res);
	            }
            }
    });
};

amplitude.passUserAPIKey = function(apiKey){
	APIKEY = apiKey;
	return this;
};

amplitude.parseEvent = function(event){

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

	return convertedEvent;
};


module.exports = amplitude;