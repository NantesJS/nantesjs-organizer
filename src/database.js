const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
const { yellow, green, red } = require('kleur')
const { spinner } = require('./spinner')

let firebaseEnabled = 'FIREBASE_DATABASE_URL' in process.env

if (firebaseEnabled) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
} else {
  console.warn(yellow('⚠️  Les données ne seront pas sauvées dans Firestore :'))
  console.warn(yellow('⚠️  La variable d\'environnement FIREBASE_DATABASE_URL n\'est pas renseignée.'))
}

exports.saveEvent = async event => {
  if (!firebaseEnabled) return

  const spinnerSave = spinner(yellow('Ecriture de l\'évènement dans Firestore...')).start()

  return admin.firestore()
    .collection('events')
    .add(event)
    .then(doc => doc.id)
    .then(id => {
      spinnerSave.succeed(green('🎉 L\'évènement a bien été sauvé dans Firestore'))

      return {
        ...event,
        id,
      }
    })
    .catch(error => {
      spinnerSave.fail(red(`Une erreur est survenue lors de la sauvegarde dans firestore : ${error}`))
    })
}

exports.saveContact = async contact => {
  if (!firebaseEnabled) return

  const spinnerSave = spinner(yellow('Ecriture du contact dans Firestore...')).start()

  return admin.firestore()
    .collection('contacts')
    .add(contact)
    .then(doc => doc.id)
    .then(id => {
      spinnerSave.succeed(green('🗃  Le contact a bien été sauvé dans Firestore'))

      return {
        ...contact,
        id,
      }
    })
    .catch(error => {
      spinnerSave.fail(red(`Une erreur est survenue lors de la sauvegarde dans firestore : ${error}`))
    })
}
