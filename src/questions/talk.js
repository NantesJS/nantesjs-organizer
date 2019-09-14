const {
  getEventSubmittedTalksTitleWithId,
  getEventTalkById,
} = require('../cfp')
const { yellow } = require('kleur')

function rejectTalkById(ids) {
  return talks => talks.filter(talk => !ids.includes(talk.id))
}

function getChoices(talks) {
  return talks.map(talk => ({
    title: talk.title,
    value: talk.id
  }))
}

exports.getTalkQuestion = async (rejectedTalkIds = []) => {
  const talks = await getEventSubmittedTalksTitleWithId()
    .then(rejectTalkById(rejectedTalkIds))

  return {
    type: 'select',
    name: 'talk',
    message: 'Choisissez un talk',
    choices: getChoices(talks),
    format: getEventTalkById,
  }
}

exports.addTalkQuestion = {
  type: 'confirm',
  name: 'addTalk',
  message: 'Souhaitez-vous ajouter un talk ?',
}
