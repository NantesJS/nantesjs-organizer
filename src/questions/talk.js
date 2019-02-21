const {
  getEventTalksTitleWithId,
  getEventTalkById,
} = require('../cfp')

exports.getTalkQuestion = async () => {
  const choices = await getEventTalksTitleWithId().then(talks => {
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
