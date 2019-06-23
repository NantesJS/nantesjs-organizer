const {
  getEventSubmittedTalksTitleWithId,
  getEventTalkById,
} = require('../cfp')

exports.getTalkQuestion = async () => {
  const choices = await getEventSubmittedTalksTitleWithId().then(talks => {
    return talks.map(talk => ({
      title: talk.title,
      value: talk.id
    }))
  })

  return {
    type: 'select',
    name: 'talk',
    message: 'Choisissez un talk',
    choices,
    format: getEventTalkById,
  }
}
