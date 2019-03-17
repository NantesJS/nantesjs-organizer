const { default: eventbrite } = require('eventbrite')
const getOr = require('lodash/fp/getOr')
const {
  bgGreen,
  bgRed,
  bold,
  green,
  red,
  white,
  yellow,
} = require('kleur')

const api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })

exports.createEvent = async meetup => {
  console.log(yellow('⏳ Création de l\'évènement sur eventbrite...'))

  const ticketsUrl = await api.users.me()
    .then(me => me.id)
    .then(userId => api.organizations.getByUser(userId))
    .then(getOr('', 'organizations[0].id'))
    .then(makeNewEvent(meetup))
    .then(event => event.url)
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      console.error(red('✖ La création de l\évènement a échouée... 😱'))
      console.error(red('✖ Voici la description de l\'erreur :'))
      console.error(white().bgRed(`[${error}] ${description}`))
    })

  if (!ticketsUrl) return meetup

  process.stdout.write(green('🎟  Voici l\'adresse vers la billeterie : '))
  console.log(bold().white().bgGreen(ticketsUrl))

  return {
    ...meetup,
    ticketsUrl,
  }
}

function makeNewEvent({ title, date }) {
  const timezone = 'Europe/Paris'
  const [day, month, year] = date.split('/')
  const dateISO = `${year}-${month}-${day}`

  const event = {
    name: {
      html: title,
    },
    start: {
      timezone,
      utc: `${dateISO}T18:00:00Z`, // 19H00 UTC+1
    },
    end: {
      timezone,
      utc: `${dateISO}T22:00:00Z`, // 23H00 UTC+1
    },
    currency: 'EUR',
  }

  const getOrganizerId = getOr('', 'organizers[0].id')

  return organizationId => {
    return api.request(`/organizations/${organizationId}/organizers/`)
      .then(getOrganizerId)
      .then(organizer_id => {
        return api.request(`/organizations/${organizationId}/events/`, {
          method: 'POST',
          body: JSON.stringify({
            event: {
              ...event,
              organizer_id,
            },
          }),
        })
      })
  }
}
