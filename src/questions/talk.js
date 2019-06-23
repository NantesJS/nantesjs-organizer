const {
  getEventSubmittedTalksTitleWithId,
  getEventTalkById,
} = require('../cfp')

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
  const talks = await getEventSubmittedTalksTitleWithId()
    .then(rejectTalkById(rejectedTalkId))

  return {
    type: 'select',
    name: 'talk',
    message: 'Choisissez un talk',
    choices: getChoices(talks),
    format: getEventTalkById,
  }
}
