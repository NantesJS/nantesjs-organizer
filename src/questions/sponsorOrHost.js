const getOr = require('lodash/fp/getOr')
const flow = require('lodash/flow')
const { isNotEmpty } = require('./validators')
const { findPlaceInNantes } = require('../places')

function getSponsorOrHostName(sponsorOrHost = 'sponsor') {
  return {
    type: 'text',
    name: 'name',
    message: `Quel est le nom de votre ${sponsorOrHost} ?`,
    validate: isNotEmpty,
  }
}

const getPlaceDetails = flow(getOr('', 'name'), findPlaceInNantes)

exports.getSponsor = async prompts =>
  prompts(getSponsorOrHostName('sponsor')).then(getPlaceDetails)

exports.getHost = async prompts =>
  prompts(getSponsorOrHostName('hébergeur')).then(getPlaceDetails)
