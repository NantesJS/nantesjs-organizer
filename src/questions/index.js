const uuid = require('uuid/v4')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { talkQuestions } = require('./talk')
const { speakerQuestions } = require('./speaker')

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
  const venue = await prompt(getSponsorOrHostQuestions('sponsor'))
  const sponsor = await prompt(getSponsorOrHostQuestions('hébergeur'))

  const talks = [
    await getTalkWithSpeaker(prompt),
    await getTalkWithSpeaker(prompt),
  ]

  return {
    ...basics,
    id: uuid(),
    venue: {
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
