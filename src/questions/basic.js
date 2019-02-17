const isInteger = require('lodash/fp/isInteger')
const { getThirdThursdayOfMonth, isValid, format } = require('../utils/date')

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
  initial: getThirdThursdayOfMonth(),
  validate: isValid,
  format,
}]
