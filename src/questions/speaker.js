const { isNotEmpty } = require('./validators')

exports.speakerQuestions = [{
	type: 'text',
	name: 'name',
	message: `Quel est le nom du speaker ?`,
  validate: isNotEmpty,
}, {
	type: 'text',
	name: 'link',
	message: `Quel est son compte twitter ?`,
  validate: isNotEmpty,
  format: (value = '') => value.startsWith('http') ? value : `https://twitter.com/${value}`
}]
