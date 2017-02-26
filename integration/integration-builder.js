'use strict';

var Amplitude = require('./amplitude-integration');
var IntegrationBuilder = {};


/** This can be extended for integration with other partners **/
IntegrationBuilder.create = (type) => {

	switch(type){
		case 'amplitude':
			return Amplitude;

		default:
			break;
	}

}


module.exports = IntegrationBuilder;