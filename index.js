'use strict';

var AWS = require('aws-sdk');

module.exports = Interface;

function Interface(opts)
{
	if (!(this instanceof Interface)) return new Interface(opts);

	this.sns = new AWS.SNS({
		region: opts.region,
		apiVersion: opts.apiVersion || '2010-03-31',
		accessKeyId: opts.accessKeyId,
		secretAccessKey: opts.secretAccessKey
	});
}

Interface.prototype.sendNotification = function(type, arn, message, url, callback)
{
	var messageJson = "";
	switch(type) {
		case 'ios': messageJson = _messageForTypeIos(message, url); break;
		case 'android': messageJson = _messageForTypeAndroid(message, url); break;
		default: throw new Error('Wrong or missing Type. Expecting "ios" or "android".');
	}

	this.sns.publish({
		TargetArn: arn,
		Message: messageJson,
		MessageStructure: 'json'
	}, callback);
}

function _messageForTypeIos(message, url)
{
	var apnsJSON = {
		aps: {
			alert: message,
	 		//badge: 1,
	 		sound: 'notice.mp3'
		},
		foyer: {
			'url': url
		}
	};
		 
	var messageJson = JSON.stringify(apnsJSON);
	
	return JSON.stringify({
		default: message,
		APNS: messageJson,
		APNS_SANDBOX: messageJson
	});
}

function _messageForTypeAndroid(message, url)
{
	throw new Error('Not implemented yet.');
}