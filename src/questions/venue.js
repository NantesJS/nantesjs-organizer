const { getVenues, getVenueById } = require('../venue')

function getChoices(venues) {
  return venues.map(venue => ({
    title: venue.name,
    value: venue.id,
  }))
}

const NEW = -1

exports.getVenueQuestion = async () => {
  const venues = await getVenues()
  const choices = [
    ...getChoices(venues),
    {
      title: 'Créer un nouveau hébergeur',
      value: NEW,
    }
  ]

  return {
    type: 'autocomplete',
    name: 'venue',
    message: 'Sélectionnez un hébergeur',
    choices,
    format: id => (id === NEW) ? undefined : getVenueById(id),
  }
}
