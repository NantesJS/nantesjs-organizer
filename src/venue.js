const {
  bgRed,
  red,
  white,
  yellow,
} = require('kleur')
const getOr = require('lodash/fp/getOr')
const { api } = require('./api')
const { spinner, returnDataAndStopSpinner } = require('./spinner')

exports.createVenue = venue => {
  const spinnerVenue = spinner(yellow('⏳ Création de l\'hébergeur dans eventbrite...')).start()

  return api.users.me()
    .then(me => me.id)
    .then(userId => api.organizations.getByUser(userId))
    .then(getOr('', 'organizations[0].id'))
    .then(makeNewVenue(venue))
    .then(newVenue => ({
      ...venue,
      id: newVenue.id,
    }))
    .then(returnDataAndStopSpinner(spinnerVenue))
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      const messages = [
        red('La création du lieu a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        white().bgRed(`[${error}] ${description}`),
      ]

      spinnerVenue.fail(messages.join('\n'))
    })
}

function makeNewVenue(venue) {
  const newVenue = {
    name: venue.name,
    google_place_id: venue.google_place_id,
    address: {
      address_1: venue.address,
      city: venue.city,
      postal_code: venue.postal_code,
      country: 'FR',
      latitude: venue.latitude,
      longitude: venue.longitude,
    }
  }

  return organizationId => {
    return api.request(`/organizations/${organizationId}/venues/`, {
      method: 'POST',
      body: JSON.stringify({
        venue: newVenue,
      }),
    })
  }
}
