const isInteger = require('lodash/fp/isInteger')
const { getNextThirdThursdayOfMonth, isValid, format } = require('../date')
const { getNextMeetupId } = require('../github')

exports.basicQuestions = [{
  type: 'number',
  name: 'title',
  message: 'Quel est le numéro de votre évènement ?',
  format: title => `Meetup #${title}`,
  initial: getNextMeetupId,
}, {
  type: 'text',
  name: 'date',
  message: 'Quelle est la date de cet évènement ?',
  initial: getNextThirdThursdayOfMonth(),
  validate: isValid,
  format,
}]
