const prompts = require('prompts')
const uuid = require('uuid/v4')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { talkQuestions } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { findPlaceInNantes } = require('../places')

const getTalkWithSpeaker = async () => {
  const talk = await prompts(talkQuestions)
  const speaker = await prompts(speakerQuestions)

  return {
    ...talk,
    id: uuid(),
    speakers: [{
      ...speaker,
      id: uuid(),
    }]
  }
}

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const venue = await prompts(getSponsorOrHostQuestions('sponsor'))
  const sponsor = await prompts(getSponsorOrHostQuestions('hébergeur'))
  const place = await findPlaceInNantes(venue.name)

  const talks = [
    await getTalkWithSpeaker(),
    await getTalkWithSpeaker(),
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
