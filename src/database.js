const admin = require('firebase-admin')
const { yellow, green, red } = require('kleur')
const addDays = require('date-fns/addDays')
const { spinner, returnDataAndStopSpinner } = require('./spinner')

const firebaseEnabled = 'FIREBASE_DATABASE_URL' in process.env

exports.FIREBASE_ENABLED = firebaseEnabled

if (firebaseEnabled) {
  const serviceAccount = require('../serviceAccountKey.json')

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
    .doc(event.id)
    .set(event)
    .then(() => {
      spinnerSave.succeed(green('🎉 L\'évènement a bien été sauvé dans Firestore'))

      return event
    })
    .catch(error => {
      spinnerSave.fail(red(`Une erreur est survenue lors de la sauvegarde dans firestore : ${error}`))
    })
}

exports.saveContact = async contact => {
  if (!firebaseEnabled) return

  const spinnerSave = spinner(yellow('Ecriture du contact dans Firestore...')).start()

  const expiresAt = addDays(new Date(), 30).toISOString()

  return admin.firestore()
    .collection('contacts')
    .doc(contact.id)
    .set({
      ...contact,
      expiresAt,
    })
    .then(() => {
      spinnerSave.succeed(green('🗃  Le contact a bien été sauvé dans Firestore'))

      return contact
    })
    .catch(error => {
      spinnerSave.fail(red(`Une erreur est survenue lors de la sauvegarde dans firestore : ${error}`))
    })
}

exports.getContacts = async () => {
  if (!firebaseEnabled) return

  const spinnerGet = spinner(yellow('Récupération des contacts dans Firestore...')).start()

  return admin.firestore()
    .collection('contacts')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }))
    })
    .then(returnDataAndStopSpinner(spinnerGet))
    .catch(error => {
      spinnerGet.fail(red(`Une erreur est survenue lors de la récupération dans firestore : ${error}`))
    })
}

exports.getContactById = async id => {
  if (!firebaseEnabled) return

  const spinnerGet = spinner(yellow('Récupération du contact dans Firestore...')).start()

  return admin.firestore()
    .collection('contacts')
    .doc(id)
    .get()
    .then(doc => {
      if (!doc.exists) throw Error(`Le contact ${id} est introuvable.`)

      return doc.data()
    })
    .then(returnDataAndStopSpinner(spinnerGet))
    .catch(error => {
      spinnerGet.fail(red(`Une erreur est survenue lors de la récupération dans firestore : ${error}`))
    })
}
