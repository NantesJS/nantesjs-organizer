const getOr = require('lodash/fp/getOr')
const googleMapsClient = require('@google/maps').createClient({
  Promise,
  key: process.env.GOOGLE_MAPS_API_KEY,
})

const getShortNameByType = (array, type) => {
  const { short_name } = array.find(({ types }) => types.includes(type))
  return short_name
}

exports.findPlaceInNantes = name =>( 
  googleMapsClient.findPlace({
    input: 'Clever Age, Nantes',
    inputtype: 'textquery',
  }).asPromise()
    .then(getOr('', 'json.candidates[0].place_id'))
    .then(placeid => googleMapsClient.place({ placeid }).asPromise())
    .then(getOr({}, 'json.result'))
    .then(({ geometry, address_components }) => {
      const street_number = getShortNameByType(address_components, 'street_number')
      const route = getShortNameByType(address_components, 'route')
      const postal_code = getShortNameByType(address_components, 'postal_code')
      const city = getShortNameByType(address_components, 'locality')

      return {
        ...geometry.location,
        postal_code,
        city,
        address: `${street_number} ${route}`,
      }
    }) 
)
