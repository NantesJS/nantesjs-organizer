const prompts = require('prompts')
const { ask } = require('./index')
const { findPlaceInNantes } = require('../places')

describe('Questions', () => {
  const sponsorName = 'My Money Bank'
  const hostName = 'Clever Age'

  beforeEach(() => {
    prompts.inject([
      37,
      '2019-02-21',
      sponsorName,
      hostName,
      'talk1',
      'talk2',
    ])
  })

  it('should return all the answers in expected format', async () => {
    expect.assertions(1)

    const responses = await ask(prompts)

    expect(responses).toEqual(expect.objectContaining({
      id: expect.any(String),
      title: 'Meetup #37',
      date: '21/02/2019',
      venue: expect.objectContaining({
        id: 'v1',
        name: 'Clever Age',
        link: 'https://www.clever-age.com',
      }),
      sponsor: expect.objectContaining({
        id: expect.any(String),
        name: 'My Money Bank',
        link: 'https://www.mymoneybank.fr',
      }),
      talks: [{
        id: 'talk1',
        title: 'Machine Learning driven user-experiences made easy with Guess.js',
        description: 'Comment faire plus hype que le Machine Learning ?! Faire de la web perf avec !!! 🤯 #PWA #AI',
        speakers: [{
          id: expect.any(String),
          name: 'NOΞL MACÉ',
          link: 'https://twitter.com/noel_mace',
        }],
      }, {
        id: 'talk2',
        title: 'Images Responsives',
        description: 'Pour garantir de bonnes performances, il faut savoir servir à l’utilisateur les bonnes ressources graphiques en fonction de son contexte d’affichage. À ce jour, il existe une technologie standard qui combine code HTML et code CSS, mais qui est souvent mal employée. Nous verrons donc pourquoi, comment y remédier, et ce à travers de nombreux exemples.',
        speakers: [{
          id: expect.any(String),
          name: 'Vincent Valentin',
          link: 'https://twitter.com/htmlvv',
        }],
      }]
    }))
  })

  it('should look for the host coordinates', async () => {
    expect.assertions(1)

    await ask(prompts)

    expect(findPlaceInNantes).toHaveBeenCalledWith(hostName)
  })

  it('should look for the sponsor coordinates', async () => {
    expect.assertions(1)

    await ask(prompts)

    expect(findPlaceInNantes).toHaveBeenCalledWith(sponsorName)
  })
})

jest.mock('../places.js', () => ({
  findPlaceInNantes: jest.fn().mockResolvedValueOnce({
    lat: 0,
    lng: 0,
    city: '',
    postal_code: '',
    address: '',
    name: 'My Money Bank',
    link: 'https://www.mymoneybank.fr',
  }).mockResolvedValueOnce({
    lat: 0,
    lng: 0,
    city: '',
    postal_code: '',
    address: '',
    name: 'Clever Age',
    link: 'https://www.clever-age.com',
  }),
}))

jest.mock('../venue.js', () => ({
  createVenue: jest.fn().mockResolvedValue('v1'),
}))

jest.mock('../cfp.js', () => {
  const talks = [{
    id: 'talk1',
    title: 'Machine Learning driven user-experiences made easy with Guess.js',
    description: 'Comment faire plus hype que le Machine Learning ?! Faire de la web perf avec !!! 🤯 #PWA #AI',
    speakers: [{
      id: 'u1',
      name: 'NOΞL MACÉ',
      link: 'https://twitter.com/noel_mace',
    }],
  },
  {
    id: 'talk2',
    title: 'Images Responsives',
    description: 'Pour garantir de bonnes performances, il faut savoir servir à l’utilisateur les bonnes ressources graphiques en fonction de son contexte d’affichage. À ce jour, il existe une technologie standard qui combine code HTML et code CSS, mais qui est souvent mal employée. Nous verrons donc pourquoi, comment y remédier, et ce à travers de nombreux exemples.',
    speakers: [{
      id: 'u2',
      name: 'Vincent Valentin',
      link: 'https://twitter.com/htmlvv',
    }],
  }]

  return {
    getEventTalkById: jest.fn().mockImplementation(id => talks.find(talk => talk.id === id)),
    getEventSubmittedTalksTitleWithId: jest.fn().mockResolvedValue(talks.map(talk => ({
      id: talk.id,
      title: talk.title,
    }))),
  }
})
