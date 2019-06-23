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

    it('should exclude t1 from choices', async () => {
      const talks = mockTalks()

      const question = await getTalkQuestion('t1')

      expect(question).toEqual(expect.objectContaining({
        choices: toChoices([talks[1]]),
      }))
    })
  })
})

function toChoices(talks) {
  return talks.map(({ id, title }) => ({ title, value: id }))
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
