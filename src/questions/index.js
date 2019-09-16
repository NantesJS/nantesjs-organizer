const prompts = require('prompts')
const uuid = require('uuid/v4')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsor, getHost } = require('./sponsorOrHost')
const { getTalkQuestion, addTalkQuestion } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { createVenue } = require('../venue')

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const sponsor = await getSponsor(prompts)
  const venue = await getHost(prompts)

  if (venue) {
    venue.id = await createVenue(venue)
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
    id: uuid(),
    venue,
    sponsor: {
      ...sponsor,
      id: uuid(),
    },
    talks,
  }
}
