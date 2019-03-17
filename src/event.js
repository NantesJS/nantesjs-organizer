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
const emojiStrip = require('emoji-strip')

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

function makeNewEvent({ title, date, talks }) {
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
    description: {
      html: getTalksDescription(talks),
    },
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

function getTalksDescription(talks) {
  return talks.map(talk => `
    <section>
      <h1>${talk.title}</h1>
      <p>${talk.description.replace(/\n/g, '<br />')}</p>
      <p>
        Animé par 
        ${talk.speakers
          .map(speaker => `<a rel="author" href="${speaker.link}">${speaker.name}</a>`)
          .join(', ')}.
      </p>
    </section>
  `).map(emojiStrip).join('')
}
