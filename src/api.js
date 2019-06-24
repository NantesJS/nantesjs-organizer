const { default: eventbrite } = require('eventbrite')
const { getOr } = require('lodash/fp')

const api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })

exports.api = api

exports.getOrganization = () => {
  return api.users.me()
    .then(me => me.id)
    .then(userId => api.organizations.getByUser(userId))
    .then(getOr('', 'organizations[0].id'))
}

exports.returnDataAndStopSpinner = spinner => {
  return data => {
    spinner.stop()
    return data
  }
}

