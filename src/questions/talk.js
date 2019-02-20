const { isNotEmpty } = require('./validators')

exports.talkQuestions = [{
  type: 'text',
  name: 'title',
  message: 'Quel est le titre du talk ?',
  validate: isNotEmpty,
}, {
  type: 'text',
  name: 'description',
  message: 'Quelle est la description du talk ?',
  validate: isNotEmpty,
}]
