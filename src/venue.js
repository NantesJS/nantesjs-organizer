const { default: eventbrite } = require('eventbrite')
const {
  bgRed,
  red,
  white,
} = require('kleur')
const getOr = require('lodash/fp/getOr')

const api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })

exports.createVenue = venue => {
  return api.users.me()
    .then(me => me.id)
    .then(userId => api.organizations.getByUser(userId))
    .then(getOr('', 'organizations[0].id'))
    .then(makeNewVenue(venue))
    .then(({ id }) => id)
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      console.error(red('✖ La création du lieu a échouée... 😱'))
      console.error(red('✖ Voici la description de l\'erreur :'))
      console.error(white().bgRed(`[${error}] ${description}`))
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
