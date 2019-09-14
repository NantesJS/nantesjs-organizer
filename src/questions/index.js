const prompts = require('prompts')
const uuid = require('uuid/v4')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsor, getHost } = require('./sponsorOrHost')
const { getTalkQuestion } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { createVenue } = require('../venue')

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const sponsor = await getSponsor(prompts)
  const venue = await getHost(prompts)

  if (venue) {
    venue.id = await createVenue(venue)
  }

  const { talk: firstTalk } = await getTalkQuestion().then(prompts)
  const { talk: secondTalk } = await getTalkQuestion(firstTalk.id).then(prompts)

  return {
    ...basics,
    id: uuid(),
    venue,
    sponsor: {
      ...sponsor,
      id: uuid(),
    },
    talks: [firstTalk, secondTalk],
  }
}
