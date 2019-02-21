const nock = require('nock')
const {
  getEventTalksTitle,
  getTalkSpeakers,
} = require('./cfp')

describe('CFP', () => {
  beforeAll(() => {
    const {
      CONFERENCE_HALL_EVENT_ID,
      CONFERENCE_HALL_API_KEY,
    } = process.env

    nock('https://conference-hall.io')
      .persist()
      .get(`/api/v1/event/${CONFERENCE_HALL_EVENT_ID}?api=${CONFERENCE_HALL_API_KEY}`)
      .reply(200, {
        talks: [{
          id: 'talk1',
          title: 'mon premier talk',
          speakers: ['speaker1'],
        }, {
          id: 'talk2',
          title: 'mon second talk',
          speakers: ['speaker2'],
        }],
        speakers: [{
          uid: 'speaker1',
          name: 'Jane Doe',
        }, {
          uid: 'speaker2',
          name: 'John Doe',
        }],
      })
  })

  it('should return talks title for my event', async () => {
    const titles = await getEventTalksTitle()

    expect(titles).toEqual(expect.arrayContaining([
      'mon premier talk',
      'mon second talk',
    ]))
  })

  it('should return speakers infos for a talk', async () => {
    const speakers = await getTalkSpeakers('talk1')

    expect(speakers).toEqual(expect.arrayContaining([{
      uid: 'speaker1',
      name: 'Jane Doe',
    }]))
  })
})
