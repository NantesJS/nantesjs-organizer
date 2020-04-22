const prompts = require('prompts')
const { v4: uuid } = require('uuid')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsor, getHost } = require('./sponsorOrHost')
const { getTalkQuestion, addTalkQuestion } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { createVenue } = require('../venue')
const { saveContact } = require('../database')

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const sponsor = await getSponsor(prompts)
  const venue = await getHost(prompts).then(createVenue)

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
    id: uuid(),
    ...basics,
    venue,
    sponsor,
    talks,
  }
}
