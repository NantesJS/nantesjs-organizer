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
  const place = await findPlaceInNantes(venue.name).catch(() => {
    console.warn(bold().red('✖ La récupération des informations relatives au lieu de l\'évènement a été infructueuse.'))
    console.warn(bold().red('✖ Tu vas devoir saisir ces informations toi-même... 😢'))
  })
  const venueId = await createVenue(place)

  const talks = [
    await getTalkQuestion().then(prompts),
    await getTalkQuestion().then(prompts),
  ]

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
    talks: talks.map(({ talk }) => talk),
  }
}
