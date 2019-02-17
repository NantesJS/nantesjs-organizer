const { isNotEmpty } = require('./validators')

exports.getSponsorOrHostQuestions = (sponsorOrHost = 'sponsor') => ([{
	type: 'text',
	name: 'name',
	message: `Quel est le nom de votre ${sponsorOrHost} ?`,
  validate: isNotEmpty,
}, {
	type: 'text',
	name: 'link',
	message: 'Quelle est l\'adresse de son site web ?',
  validate: isNotEmpty,
}])
