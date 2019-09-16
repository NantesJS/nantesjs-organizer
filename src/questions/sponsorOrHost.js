const getOr = require('lodash/fp/getOr')
const isAfter = require('date-fns/isAfter')
const { isNotEmpty } = require('./validators')
const { findPlaceInNantes } = require('../places')
const {
  FIREBASE_ENABLED,
  getContacts,
  getContactById,
  saveContact,
} = require('../database')

exports.getSponsor = getContact('sponsor')

exports.getHost = getContact('hébergeur')

function getContact(sponsorOrHost = 'sponsor') {
  if (FIREBASE_ENABLED) {
    return prompts => getSponsorOrHost(sponsorOrHost)
      .then(prompts)
      .then(({ contact }) => {
        if (!contact) return getContactByName(sponsorOrHost)(prompts)

        if (isAfter(new Date(), new Date(contact.expiresAt))) {
          return findPlaceInNantes(contact.name).then(saveContact)
        }

        return contact
      })
  }

  return getContactByName(sponsorOrHost)
}

function getContactByName(sponsorOrHost = 'sponsor') {
  const question = {
    type: 'text',
    name: 'name',
    message: `Quel est le nom de votre ${sponsorOrHost} ?`,
    validate: isNotEmpty,
  }

  return prompts => prompts(question)
    .then(getOr('', 'name'))
    .then(findPlaceInNantes)
    .then(saveContact)
}

async function getSponsorOrHost(sponsorOrHost = 'sponsor') {
  const NEW = -1

  const choices = await getContactChoices().then(contacts => [
    ...contacts,
    {
      title: 'NOUVEAU CONTACT',
      value: NEW,
    },
  ])

  return {
    type: 'autocomplete',
    name: 'contact',
    message: `Quel est votre ${sponsorOrHost} ?`,
    choices,
    format: id => (id === NEW) ? undefined : getContactById(id),
  }
}

function getContactChoices() {
  return getContacts().then(contacts => {
    return contacts.map(contact => ({
      title: contact.name,
      value: contact.id,
    }))
  })
}
