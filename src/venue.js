const {
  bgRed,
  red,
  white,
  yellow,
} = require('kleur')
const getOr = require('lodash/fp/getOr')
const { spinner, returnDataAndStopSpinner } = require('./spinner')
const { api, getOrganization } = require('./api')

exports.createVenue = venue => {
  const spinnerVenue = spinner(yellow('⏳ Création de l\'hébergeur dans eventbrite...')).start()

  return getOrganization()
    .then(makeNewVenue(venue))
    .then(({ id }) => String(id))
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

exports.getVenues = () => {
  const spinnerVenue = spinner(yellow('⏳ Récupération des hébergeurs dans eventbrite...')).start()

  return getOrganization()
    .then(organizationId => {
      return api.request(`/organizations/${organizationId}/venues/`)
    })
    .then(getOr([], 'venues'))
    .then(returnDataAndStopSpinner(spinnerVenue))
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      const messages = [
        red('La récupération des hébergeurs a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        white().bgRed(`[${error}] ${description}`),
      ]

      spinnerVenue.fail(messages.join('\n'))
    })
}

exports.getVenueById = async id => {
  const spinnerVenue = spinner(yellow(`⏳ Récupération de l\'hébergeur ${id} dans eventbrite...`)).start()

  return api.request(`/venues/${id}/`)
    .then(returnDataAndStopSpinner(spinnerVenue))
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      const messages = [
        red('La récupération des hébergeurs a échouée... 😱'),
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
