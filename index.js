'use strict'

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

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "Fresh Food Company",
				    "subtitle": "This 35,000-square-foot renovated facility opened in January 2013 in Newcomb Hall. There are eight prepared-to-order stations, including Mongolian Grill, Deli, Vegan Station, Produce & Salad Bar, and much more! UVa students have embraced the 'new' Newcomb and laud its menu choices as well as its comfortable and fun dining atmosphere.",
				    "image_url": "https://news.virginia.edu/sites/default/files/article_image/NewcombDining011413_01.jpeg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "http://virginia.campusdish.com/Commerce/Catalog/Menus.aspx?LocationId=704",
					    "title": "Website Menu"
				    }, {
					    "type": "postback",
					    "title": "Send Menu as Message",
					    "payload": "Newcomb Menu",
				    }],
			    }, {
				    "title": "Observatory Hill Dining Room",
				    "subtitle": "Observatory Hill is located on the southwestern corner of Alderman and McCormick Roads near the first-year residences. More commonly known as O'Hill, this dining room has a large seating area with two levels, and eight stations to choose from! ",
				    "image_url": "http://virginia.campusdish.com/-/media/Images/Aramark/Higher-Education/Eastern/Virginia/Location/ObservatoryHill-Dining-225x150.jpg?h=150&la=en&w=222&hash=59AFD7D6FE0377A53E164559A695BD8388577DFB",
				    "buttons": [{
				    	"type": "web_url",
				    	"url": "http://virginia.campusdish.com/Commerce/Catalog/Menus.aspx?LocationId=695",
				    	"title": "Website Menu"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
					}
				    ],
			    }]
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
  	    if (text === 'Menus') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
  	    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
  	    let text = JSON.stringify(event.postback)
  	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
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