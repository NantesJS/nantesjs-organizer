const getOr = require('lodash/fp/getOr')
const googleMapsClient = require('@google/maps').createClient({
  Promise,
  key: process.env.GOOGLE_MAPS_API_KEY,
})
const { bold, green, yellow, red } = require('kleur')
const { spinner } = require('./spinner')

const getShortNameByType = (array, type) => {
  const { short_name } = array.find(({ types }) => types.includes(type))
  return short_name
}

exports.findPlaceInNantes = name => {
  const spinnerPlace = spinner(yellow('⏳ Récupération des coordonnées de l\'hébergeur...')).start()

  return googleMapsClient.findPlace({
    input: `${name}, Nantes`,
    inputtype: 'textquery',
  }).asPromise()
    .then(getOr('', 'json.candidates[0].place_id'))
    .then(placeid => googleMapsClient.place({ placeid }).asPromise())
    .then(getOr({}, 'json.result'))
    .then(({ geometry, address_components, place_id, name }) => {
      const street_number = getShortNameByType(address_components, 'street_number')
      const route = getShortNameByType(address_components, 'route')
      const postal_code = getShortNameByType(address_components, 'postal_code')
      const city = getShortNameByType(address_components, 'locality')

      spinnerPlace.succeed(green('🏡 Les coordonnées de l\'hébergeur ont été récupérées avec succès'))

      return {
        ...geometry.location,
        postal_code,
        city,
        address: `${street_number} ${route}`,
        name,
        google_place_id: place_id,
      }
    })
    .catch(() => {
      const messages = [
        bold().red('La récupération des informations relatives au lieu de l\'évènement a été infructueuse.'),
        bold().red('✖ Tu vas devoir saisir ces informations toi-même... 😢'),
      ]
      spinnerPlace.fail(messages.join('\n'))
    })
}
