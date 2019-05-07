const { default: eventbrite } = require('eventbrite')
const {
  bgRed,
  red,
  white,
} = require('kleur')
const getOr = require('lodash/fp/getOr')

const api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })

exports.createTickets = (eventId) => {
  return api.request(`/events/${eventId}/ticket_classes/`, {
    method: 'POST',
    body: JSON.stringify({
      ticket_class: {
        name: 'Participants',
        donation: false,
        free: true,
        minimum_quantity: 1,
        maximum_quantity: 10,
        quantity_total: 30,
        delivery_methods: ['electronic'],
      },
    }),
  })
  .catch(({ parsedError }) => {
    const { error, description } = parsedError

    console.error(red('✖ La création des tickets a échouée... 😱'))
    console.error(red('✖ Voici la description de l\'erreur :'))
    console.error(white().bgRed(`[${error}] ${description}`))
  })
}

