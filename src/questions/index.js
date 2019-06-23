const prompts = require('prompts')
const uuid = require('uuid/v4')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { getTalkQuestion } = require('./talk')
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

  const { talk: firstTalk } = await getTalkQuestion().then(prompts)
  const { talk: secondTalk } = await getTalkQuestion(firstTalk.id).then(prompts)

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
    talks: [firstTalk, secondTalk],
  }
}
