const httpie = require('httpie')

const getEvent = () => {
  const {
    CONFERENCE_HALL_EVENT_ID,
    CONFERENCE_HALL_API_KEY,
  } = process.env
  const BASE_URI = 'https://conference-hall.io'
  const API_URL = `${BASE_URI}/api/v1/event/${CONFERENCE_HALL_EVENT_ID}?api=${CONFERENCE_HALL_API_KEY}`

  return httpie.get(API_URL).then(response => response.data)
}

exports.getEventTalksTitle = () => getEvent().then(event => {
  return event.talks.flatMap(talk => talk.title)
})

exports.getTalkSpeakers = async talkId => {
  const event = await getEvent()
  const talk = event.talks.find(talk => talk.id === talkId)

  return talk.speakers.map(uid => {
    return event.speakers.find(speaker => speaker.uid === uid)
  })
}
