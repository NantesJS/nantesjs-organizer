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
const { createTickets } = require('./tickets')

const api = eventbrite({ token: process.env.EVENTBRITE_API_KEY })

exports.createEvent = async meetup => {
  console.log(yellow('⏳ Création de l\'évènement sur eventbrite...'))

  const event = await api.users.me()
    .then(me => me.id)
    .then(userId => api.organizations.getByUser(userId))
    .then(getOr('', 'organizations[0].id'))
    .then(makeNewEvent(meetup))
    .catch(({ parsedError }) => {
      const { error, description } = parsedError

      console.error(red('✖ La création de l\évènement a échouée... 😱'))
      console.error(red('✖ Voici la description de l\'erreur :'))
      console.error(white().bgRed(`[${error}] ${description}`))
    })

  if (!event) return meetup

  await createTickets(event.id)

  process.stdout.write(green('🎟  Voici l\'adresse vers la billeterie : '))
  console.log(bold().white().bgGreen(event.url))

  return {
    ...meetup,
    ticketsUrl: event.url,
  }
}

function makeNewEvent(meetup) {
  const timezone = 'Europe/Paris'
  const [day, month, year] = meetup.date.split('/')
  const dateISO = `${year}-${month}-${day}`

  const event = {
    name: {
      html: meetup.title,
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
      html: getMeetupDescription(meetup),
    },
    venue_id: meetup.venue.id,
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

function getMeetupDescription({ talks, venue, sponsor }) {
  return `
    <article>
      <p>Au programme :</p>
      ${getTalksDescription(talks)}
      <address>
        On se retrouve chez <a href="${venue.link}">${venue.name}</a> 
        et c'est <a href="${sponsor.link}">${sponsor.name}</a> 
        qui offre le miam et la boisson ! Pleins de merci à eux.
      </address>
    </article>
  `
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
