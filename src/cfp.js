const httpie = require('httpie')
const { bold, red, yellow } = require('kleur')
const { spinner, returnDataAndStopSpinner } = require('./spinner')

const getEvent = () => {
  const {
    CONFERENCE_HALL_EVENT_ID,
    CONFERENCE_HALL_API_KEY,
  } = process.env
  const BASE_URI = 'https://conference-hall.io'
  const API_URL = `${BASE_URI}/api/v1/event/${CONFERENCE_HALL_EVENT_ID}?key=${CONFERENCE_HALL_API_KEY}`
  const spinnerEvent = spinner(yellow('⏳ Récupération de l\'évènement sur Conference-hall...')).start()

  return httpie.get(API_URL)
    .then(response => response.data)
    .then(returnDataAndStopSpinner(spinnerEvent))
    .catch(({ data }) => {
      const messages = [
        red('La récupération de l\'évènement sur Conference-hall a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        bold().white().bgRed(data.error),
      ]
      spinnerEvent.fail(messages.join('\n'))
    })
}

exports.getEventSubmittedTalksTitleWithId = () => getEvent().then(event => {
  return event.talks
    .filter(({ state }) => state === 'submitted')
    .flatMap(({ id, title }) => ({ id, title }))
})

exports.getEventTalkById = async talkId => {
  const event = await getEvent()
  const talk = event.talks.find(talk => talk.id === talkId)
  const speakers = talk.speakers.map(uid => {
    return event.speakers.find(speaker => speaker.uid === uid)
  })

  return {
    id: talk.id,
    title: talk.title,
    description: talk.abstract,
    speakers: speakers.map(speaker => {
      let link = ''

      if (speaker.twitter) {
        const handle = speaker.twitter.replace('@', '')
        link = `https://twitter.com/${handle}`
      }

      return {
        id: speaker.uid,
        name: speaker.displayName,
        link,
      }
    }),
  }
}
