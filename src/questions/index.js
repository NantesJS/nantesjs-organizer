const prompts = require('prompts')
const uuid = require('uuid/v4')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { getTalkQuestion, addTalkQuestion } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { findPlaceInNantes } = require('../places')
const { createVenue } = require('../venue')

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const sponsor = await prompts(getSponsorOrHostQuestions('sponsor'))
  const venue = await prompts(getSponsorOrHostQuestions('hébergeur'))
  const place = await findPlaceInNantes(venue.name)

  let venueId

  if (place) {
    venueId = await createVenue(place)
  }

  const talks = []
  let addTalk = true

  do {
    const excludedTalkIds = talks.map(talk => talk.id)

    const { talk } = await getTalkQuestion(excludedTalkIds).then(prompts)
    talks.push(talk)

    const addTalkAnswer = await prompts(addTalkQuestion)
    addTalk = addTalkAnswer.addTalk
  } while (addTalk)

  return {
    ...basics,
    ...place,
    id: uuid(),
    venue: {
      ...place,
      ...venue,
      id: venueId,
    },
    sponsor: {
      ...sponsor,
      id: uuid(),
    },
    talks,
  }
}
