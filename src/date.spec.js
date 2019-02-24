const { getNextThirdThursdayOfMonth, isValid, format } = require('./date')

describe('Date', () => {
  describe('getNextThirdThursdayOfMonth', () => {
    it('should return 2019-02-21', () => {
      const today = new Date('2019-02-11')

      const thirdThursday = getNextThirdThursdayOfMonth(today)

      expect(thirdThursday).toBe('2019-02-21')
    })

    it('should return 2019-03-21', () => {
      const today = new Date('2019-02-24')

      const thirdThursday = getNextThirdThursdayOfMonth(today)

      expect(thirdThursday).toBe('2019-03-21')
    })
  })

  describe('isValid', () => {
    const today = new Date('2019-02-24')

    it('should return false if date is invalid', () => {
      const invalidDate = new Date('21/02/2019')

      expect(isValid(invalidDate)).toBe(false)
    })

    it('should return false if date is past', () => {
      const pastDate = new Date('2019-02-21')

      expect(isValid(pastDate, today)).toBe(false)
    })

    it('should return true if date is valid and not past', () => {
      const validDate = new Date('2200-02-21')

      expect(isValid(validDate, today)).toBe(true)
    })
  })

  describe('format', () => {
    it('should return 21/02/2019', () => {
      const isoDate = '2019-02-21'

      expect(format(isoDate)).toBe('21/02/2019')
    })
  })
})
