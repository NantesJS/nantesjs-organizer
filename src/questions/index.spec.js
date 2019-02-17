const prompts = require('prompts')
const { ask } = require('./index')

describe('Questions', () => {
  beforeAll(() => {
    prompts.inject([
      37,
      '2019-02-21',
      'My Money Bank',
      'https://www.mymoneybank.fr',
      'Clever Age',
      'https://www.clever-age.com',
      'Machine Learning driven user-experiences made easy with Guess.js',
      'Comment faire plus hype que le Machine Learning ?! Faire de la web perf avec !!! 🤯 #PWA #AI',
      'NOΞL MACÉ',
      'https://twitter.com/noel_mace',
      'Images Responsives',
      'Pour garantir de bonnes performances, il faut savoir servir à l’utilisateur les bonnes ressources graphiques en fonction de son contexte d’affichage. À ce jour, il existe une technologie standard qui combine code HTML et code CSS, mais qui est souvent mal employée. Nous verrons donc pourquoi, comment y remédier, et ce à travers de nombreux exemples.',
      'Vincent Valentin',
      'htmlvv',
    ])
  })

  it('should return all the answers in expected format', async () => {
    expect.assertions(1)

    const responses = await ask(prompts)

    expect(responses).toEqual(expect.objectContaining({
      id: expect.any(String),
      title: 'Meetup #37',
      date: '21/02/2019',
      venue: {
        id: expect.any(String),
        name: 'My Money Bank',
        link: 'https://www.mymoneybank.fr',
      },
      sponsor: {
        id: expect.any(String),
        name: 'Clever Age',
        link: 'https://www.clever-age.com',
      },
      talks: [{
        id: expect.any(String),
        title: 'Machine Learning driven user-experiences made easy with Guess.js',
        description: 'Comment faire plus hype que le Machine Learning ?! Faire de la web perf avec !!! 🤯 #PWA #AI',
        speakers: [{
          id: expect.any(String),
          name: 'NOΞL MACÉ',
          link: 'https://twitter.com/noel_mace',
        }],
      }, {
        id: expect.any(String),
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
})
