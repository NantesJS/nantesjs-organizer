const { getTalkQuestion } = require('./talk')
const { getEventSubmittedTalksTitleWithId } = require('../cfp')

describe('talk', () => {
  describe('getTalkQuestion', () => {
    it('should ask to pick a talk', async () => {
      const talks = mockTalks()

      const question = await getTalkQuestion()

      expect(question).toEqual(expect.objectContaining({
        type: 'select',
        name: 'talk',
        message: 'Choisissez un talk',
      }))
    })

    it('should propose a list of submitted talk', async () => {
      const talks = mockTalks()

      const question = await getTalkQuestion()

      expect(question).toEqual(expect.objectContaining({
        choices: toChoices(talks),
      }))
    })

    it('should exclude first talk from choices', async () => {
      const talks = mockTalks()
      const firstTalk = talks[0]

      const question = await getTalkQuestion(firstTalk.id)

      expect(question).toEqual(expect.objectContaining({
        choices: expect.not.arrayContaining([
          toChoice(firstTalk),
        ]),
      }))
    })
  })
})

function toChoices(talks) {
  return talks.map(toChoice)
}

function toChoice(talk) {
  return { title: talk.title, value: talk.id }
}

function mockTalks() {
  const talks = [
    { id: 't1', title: 'talk #1' },
    { id: 't2', title: 'talk #2' },
  ]
  getEventSubmittedTalksTitleWithId.mockResolvedValueOnce(talks)

  return talks
}

jest.mock('../cfp.js')
