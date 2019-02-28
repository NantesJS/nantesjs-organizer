const isInteger = require('lodash/fp/isInteger')
const { getNextThirdThursdayOfMonth, isValid, format } = require('../date')

exports.basicQuestions = [{
  type: 'number',
  name: 'title',
  message: 'Quel est le numéro de votre évènement ?',
  validate: isInteger,
  format: title => `Meetup #${title}`,
}, {
  type: 'text',
  name: 'date',
  message: 'Quelle est la date de cet évènement ?',
  initial: getNextThirdThursdayOfMonth(),
  validate: isValid,
  format,
}]
