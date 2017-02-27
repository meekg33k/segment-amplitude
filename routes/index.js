'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var IntegrationBuilder = require('../integration/integration-builder');
const APIKEY = process.env.APIKEY || "YOUR_API_KEY"; //<========= insert your API_KEY here


router.get('/', (req, res, next) => {
	/** Temporary redirect **/
  	res.redirect('/v1/amplitude');
});

router.get('/v1/amplitude', (req, res, next) => {
  	res.sendFile(__dirname.substring(0, __dirname.length - 6) + '/views/info.html');
});

router.post('/v1/amplitude', (req, res) => {
	var apiKey = req.body.api_key || APIKEY; //<==== Strictly for testing purposes

	var AmplitudeIntegrationObj = IntegrationBuilder
									.create('amplitude')
									.passUserAPIKey(apiKey);

	if (!req.body.event){
		res.status(400).send(AmplitudeIntegrationObj.errorCodes["missing argument event"]);
	}
	else{
		var e = AmplitudeIntegrationObj.parseEvent(req.body.event); 
		var event = [];
		event.push(e);

		AmplitudeIntegrationObj.emitEvent(JSON.stringify(event), (err, response) => {
			if (err){
				console.log(err);
				res.status(500).send(AmplitudeIntegrationObj.getError("Error registering event", e.insert_id));
			}
			else{

				if (response.statusCode != 200){
					if (AmplitudeIntegrationObj.errorCodes[response.body]){
						/** Our-Defined Errors **/
						res.status(AmplitudeIntegrationObj.errorCodes[response.body].status)
							.send(AmplitudeIntegrationObj.getError(response.body, e.insert_id));
					}
					else{
						/** Amplitude-Defined Errors **/
						res.status(400).send(AmplitudeIntegrationObj.getError(response.body, e.insert_id));
					}
				}
			  	if (!err && response.statusCode == 200) {
			    	res.status(200).send({"message": "Success"});
			  	}
			}	
		});
	}
});

module.exports = router;