const app1 = require('apiai')("bed11a56f16e496c8f92c9995e4c6fcc");


function sendAPIMessage(text, sender) {
	 let messageData = { text:text }
		let api_ai_request = app1.textRequest(text, {
	    sessionId: '1234567890'
	});

	api_ai_request.on('response', function(response) {
	    let tempmessageData = response.result.fulfillment.speech;
	    messageData = { text:tempmessageData }
	    console.log(messageData)
	});
	 
	api_ai_request.on('error', function(error) {
	    console.log(error);
	});

	api_ai_request.end()
}



sendAPIMessage('haha', 'doesn')