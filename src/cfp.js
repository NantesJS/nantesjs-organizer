const httpie = require('httpie')
const { bold, red } = require('kleur')

const getEvent = () => {
  const {
    CONFERENCE_HALL_EVENT_ID,
    CONFERENCE_HALL_API_KEY,
  } = process.env
  const BASE_URI = 'https://conference-hall.io'
  const API_URL = `${BASE_URI}/api/v1/event/${CONFERENCE_HALL_EVENT_ID}?key=${CONFERENCE_HALL_API_KEY}`

  return httpie.get(API_URL)
    .then(response => response.data)
    .catch(({ data }) => {
      console.error(red('✖ La récupération de l\'évènement a échouée... 😱'))
      console.error(red('✖ Voici la description de l\'erreur :'))
      console.error(bold().white().bgRed(data.error))
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
