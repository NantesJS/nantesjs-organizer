const { default: eventbrite } = require('eventbrite')

exports.api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })
