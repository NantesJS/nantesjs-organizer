const uuid = require('uuid/v4')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { talkQuestions } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { findPlaceInNantes } = require('../places')

const getTalkWithSpeaker = async prompt => {
  const talk = await prompt(talkQuestions)
  const speaker = await prompt(speakerQuestions)

  return {
    ...talk,
    id: uuid(),
    speakers: [{
      ...speaker,
      id: uuid(),
    }]
  }
}

exports.ask = async prompt => {
  const basics = await prompt(basicQuestions)
  const sponsor = await prompt(getSponsorOrHostQuestions('sponsor'))
  const venue = await prompt(getSponsorOrHostQuestions('hébergeur'))
  const place = await findPlaceInNantes(venue.name)

  const talks = [
    await getTalkWithSpeaker(prompt),
    await getTalkWithSpeaker(prompt),
  ]

  return {
    ...basics,
    ...place,
    id: uuid(),
    venue: {
      ...place,
      ...venue,
      id: uuid(),
    },
    sponsor: {
      ...sponsor,
      id: uuid(),
    },
    talks,
  }
}
