var express = require('express');
var router = express.Router();
var request = require('request');

var IntegrationBuilder = require('../integration/integration-builder');
//const APIKEY = "c9287e815af0cb24251ba81236f2fad9"; //<========= this will not be hard-coded in production setting
const APIKEY = process.env.APIKEY;

/* GET index page. */
router.get('/', (req, res, next) => {
	/** Temporary redirect **/
  	res.redirect('/v1/amplitude');
});


router.get('/v1/amplitude', (req, res, next) => {
  	res.sendFile(__dirname.substring(0, __dirname.length - 6) + '/views/info.html');
});


router.post('/v1/amplitude', (req, res) => {
	var apiKey = APIKEY;

	/* Create Amplitude-Integration object **/
	AmplitudeIntegrationObj = IntegrationBuilder
									.create('amplitude')
									.passUserAPIKey(apiKey);

	var e = AmplitudeIntegrationObj.parseEvent(req.body); 

	if (!req.body){
		res.status(400).send(AmplitudeIntegrationObj.errorCodes["missing argument event"].message);
	}

	else{
		var event = [];
		event.push(e);

		AmplitudeIntegrationObj.emitEvent(JSON.stringify(event), (err, response) => {

			if (err){
				res.status(500).send("Error registering event"+"\nID: "+e.insert_id);
			}
			else{

				if (response.statusCode != 200){
					res.status(AmplitudeIntegrationObj.errorCodes[response.body].status)
							.send(AmplitudeIntegrationObj.errorCodes[response.body].message+"\nID: "+e.insert_id);
				}


			  	if (!err && response.statusCode == 200) {
			    	res.status(200).send("Success");
			  	}
			}	
		});
	}
	//res.status(200).send("success");
});


module.exports = router;