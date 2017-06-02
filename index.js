'use strict'
//This is for api.ai 
var apiai = require('apiai');
 
var app = apiai("bed11a56f16e496c8f92c9995e4c6fcc");

//this is for rest of the program
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

// function sendAPIMessage(text, sender) {
// 		var request = app.textRequest('22903', {
// 	    sessionId: '1'
// 	});
	 
// 	request.on('response', function(response) {
// 	    messageData = response.result.fulfillment.speech;
// 	});
	 
// 	request.on('error', function(error) {
// 	    console.log(error);
// 	});
	 
// 	request({
// 		    url: 'https://graph.facebook.com/v2.6/me/messages',
// 		    qs: {access_token:token},
// 		    method: 'POST',
// 		    json: {
// 			    recipient: {id:sender},
// 			    message: messageData,
// 		    }
// 	    }, function(error, response, body) {
// 		    if (error) {
// 			    console.log('Error sending messages: ', error)
// 		    } else if (response.body.error) {
// 			    console.log('Error: ', response.body.error)
// 		    }
// 	    })


// }
function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "Newcomb Dining Hall",
				    "subtitle": "This 35,000-square-foot renovated facility opened in January 2013 in Newcomb Hall. There are eight prepared-to-order stations, including Mongolian Grill, Deli, Vegan Station, Produce & Salad Bar, and much more! UVa students have embraced the 'new' Newcomb and laud its menu choices as well as its comfortable and fun dining atmosphere.",
				    "image_url": "https://news.virginia.edu/sites/default/files/article_image/NewcombDining011413_01.jpeg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "http://virginia.campusdish.com/Commerce/Catalog/Menus.aspx?LocationId=704",
					    "title": "See Menu"
				    }, {
				    	"type": "postback",
				    	"title": "Hours of Operation",
				    	"payload": "Newc_Hours",
				    }],
			    }, {
				    "title": "Observatory Hill Dining Room",
				    "subtitle": "Observatory Hill is located on the southwestern corner of Alderman and McCormick Roads near the first-year residences. More commonly known as O'Hill, this dining room has a large seating area with two levels, and eight stations to choose from! ",
				    "image_url": "http://virginia.campusdish.com/-/media/Images/Aramark/Higher-Education/Eastern/Virginia/Location/ObservatoryHill-Dining-225x150.jpg?h=150&la=en&w=222&hash=59AFD7D6FE0377A53E164559A695BD8388577DFB",
				    "buttons": [{
				    	"type": "web_url",
				    	"url": "https://www.fm.virginia.edu/fpc/featuredprojects/OHillDining/Photos/Renderings/OhillDiningEntry.jpg",
				    	"title": "See Menu"
				    }, {
						"type": "postback",
						"title": "Hours of Operation",
						"payload": "Ohill_Hours",
					}
				    ],
			    },{
				    "title": "Runk Dining Room",
				    "subtitle": "Runk Dining is open to all, but mainly serves the Hereford College and Gooch/Dillard residents. It's convenient to the Student Activities Building, the Piedmont Faculty Housing area, and the McCormick Observatory.",
				    "image_url": "http://www.globalsustainability.virginia.edu/wp-content/uploads/2014/07/1782519_10204400187669979_8875502862353311649_o-1024x768.jpg",
				    "buttons": [{
				    	"type": "web_url",
				    	"url": "http://virginia.campusdish.com/Commerce/Catalog/Menus.aspx?LocationId=701",
				    	"title": "See Menu"
				    }, {
						"type": "postback",
						"title": "Hours of Operation",
						"payload": "Runk_Hours",
					}
				    ],
			    }
			    ]
		    }
	    }
    }

                                                                            

    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

 app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
  	    let text = event.message.text
  	    if (text === 'Menus' || text === 'menus' || text === 'menu' || text === 'Menu') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
  	    //sendAPIMessage(text, sender)
  	    sendTextMessage(sender, "To get started, respond with 'Menus'")
      }
      if (event.postback) {
  	    let text = JSON.stringify(event.postback)
  	    text = text.substring(12, text.length - 2)
  	    if (text === 'Newc_Hours') {
  	    	text = `Newcomb Dining Hall Hours of Operation

Monday-Thursday: 7:00 am - 8:00 pm
Friday: 7:00 am - 2:15 pm
Saturday: 10:00 am - 2:00 pm
Sunday: 10:00 am - 8:00 pm`
  	    }
  	    if (text === 'Ohill_Hours'){
  	    	text = `Observatory Hill Hours of Operation

Monday-Friday: 7:00 am - 9:00 pm
Saturday-Sunday: 8:00 am - 9:00 pm`
	    }

	    if (text === 'Runk_Hours') {
	    	text = `Runk Dining Hall Hours of Operation

Monday-Thursday: 7:00 am - 10:00 pm 
Friday: 7:00 am - 8:00 pm
Saturday-Sunday: 10:00 am - 8:00 pm`
	    }
  	    sendTextMessage(sender, text.substring(0, 200), token)
  	    continue
      }
    }
    res.sendStatus(200)
  })

const token = "EAACOO8yuxj8BACBe3m2cSg6R0UBJJNE3LGEPfJgdhaztZCCRYxMK0g5gEqh5uZC44h1somOhY8d8NODbnmQfk9Co0wV9i8DSxUCNZBKguBfb7RVWsQZA8NDwtyC7RHOCB4JcmhCjtjFXzcRZAZAw7b81RQtpW1MvAIWKU3d0M0gAZDZD"
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port')
})