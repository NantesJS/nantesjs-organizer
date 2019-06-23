const nock = require('nock')
const {
  getEventSubmittedTalksTitleWithId,
  getTalkSpeakers,
  getEventTalkById,
} = require('./cfp')

describe('CFP', () => {
  beforeAll(mockCFP)

  it('should return talks title for my event', async () => {
    const titles = await getEventSubmittedTalksTitleWithId()

    expect(titles).toEqual([
      { id: 'talk1', title: 'mon premier talk' },
    ])
  })

  it('should return formatted talk', async () => {
    const talk = await getEventTalkById('talk1')

    expect(talk).toEqual({
      id: 'talk1',
      title: 'mon premier talk',
      description: 'La description de mon premier talk !',
      speakers: expect.arrayContaining([
        expect.objectContaining({
          id: 'speaker1',
          name: 'Jane Doe',
          link: 'https://twitter.com/jane_doe',
        }),
      ])
    })
  })
})

function mockCFP() {
  const {
    CONFERENCE_HALL_EVENT_ID,
    CONFERENCE_HALL_API_KEY,
  } = process.env

  nock('https://conference-hall.io')
    .persist()
    .get(`/api/v1/event/${CONFERENCE_HALL_EVENT_ID}?key=${CONFERENCE_HALL_API_KEY}`)
    .reply(200, {
      talks: [{
        id: 'talk1',
        title: 'mon premier talk',
        abstract: 'La description de mon premier talk !',
        speakers: ['speaker1'],
        state: 'submitted',
      }, {
        id: 'talk2',
        title: 'mon second talk',
        abstract: 'Voici mon second talk !',
        speakers: ['speaker2'],
        state: 'accepted',
      }, {
        id: 'talk3',
        title: 'mon troisième talk',
        abstract: 'Voici mon troisième talk !',
        speakers: ['speaker3'],
        state: 'rejected',
      }, {
        id: 'talk4',
        title: 'mon quatrième talk',
        abstract: 'Voici mon quatrième talk !',
        speakers: ['speaker4'],
        state: 'confirmed',
      }, {
        id: 'talk5',
        title: 'mon cinquième talk',
        abstract: 'Voici mon cinquième talk !',
        speakers: ['speaker5'],
        state: 'declined',
      }],
      speakers: [{
        uid: 'speaker1',
        displayName: 'Jane Doe',
        twitter: '@jane_doe',
      }, {
        uid: 'speaker2',
        displayName: 'John Doe',
      }],
    })
}
