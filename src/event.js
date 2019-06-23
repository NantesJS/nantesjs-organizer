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
const { api } = require('./api')

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

function getUTC (dateTime) {
  return new Date(dateTime).toISOString()
}

exports.makeNewEvent = meetup => {
  const timezone = process.env.TZ
  const [day, month, year] = meetup.date.split('/')
  const dateISO = `${year}-${month}-${day}`

  const event = {
    name: {
      html: meetup.title,
    },
    start: {
      timezone,
      utc: getUTC(`${dateISO} 19:00`),
    },
    end: {
      timezone,
      utc: getUTC(`${dateISO} 22:00`),
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
