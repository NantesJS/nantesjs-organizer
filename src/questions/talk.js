const {
  getEventSubmittedTalksTitleWithId,
  getEventTalkById,
} = require('../cfp')
const ora = require('ora')
const { yellow } = require('kleur')

function rejectTalkById(id) {
  return talks => talks.filter(talk => talk.id !== id)
}

function getChoices(talks) {
  return talks.map(talk => ({
    title: talk.title,
    value: talk.id
  }))
}

exports.getTalkQuestion = async rejectedTalkId => {
  const spinner = ora(yellow('⏳ Récupération de la liste coordonnées des talks...')).start()

  const talks = await getEventSubmittedTalksTitleWithId()
    .then(rejectTalkById(rejectedTalkId))

  spinner.stop()

  return {
    type: 'select',
    name: 'talk',
    message: 'Choisissez un talk',
    choices: getChoices(talks),
    format: getEventTalkById,
  }
}
