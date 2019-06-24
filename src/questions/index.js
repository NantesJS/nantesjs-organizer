const prompts = require('prompts')
const uuid = require('uuid/v4')
const { bold, red } = require('kleur')
const { basicQuestions } = require('./basic')
const { getSponsorOrHostQuestions } = require('./sponsorOrHost')
const { getVenueQuestion } = require('./venue')
const { getTalkQuestion } = require('./talk')
const { speakerQuestions } = require('./speaker')
const { findPlaceInNantes } = require('../places')
const { createVenue, getVenueById } = require('../venue')

exports.ask = async () => {
  const basics = await prompts(basicQuestions)
  const sponsor = await prompts(getSponsorOrHostQuestions('sponsor'))

  let { venue } = await getVenueQuestion().then(prompts)

  if (!venue) {
    const host = await prompts(getSponsorOrHostQuestions('hébergeur'))
    venue = await findPlaceInNantes(host.name)
      .then(createVenue)
      .then(getVenueById)
  }

  const { talk: firstTalk } = await getTalkQuestion().then(prompts)
  const { talk: secondTalk } = await getTalkQuestion(firstTalk.id).then(prompts)

  return {
    ...basics,
    id: uuid(),
    venue: formatVenue(venue),
    sponsor: {
      ...sponsor,
      id: uuid(),
    },
    talks: [firstTalk, secondTalk],
  }
}

function formatVenue(venue = {}) {
  const { address = {} } = venue

  return {
    id: String(venue.id),
    name: venue.name,
    postal_code: address.postal_code,
    address: address.address_1,
    city: address.city,
    lat: venue.latitude,
    lng: venue.longitude,
  }
}

