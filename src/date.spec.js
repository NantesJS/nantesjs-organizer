const { getThirdThursdayOfMonth, isValid, format } = require('./date')

describe('Date', () => {
  describe('getThirdThursdayOfMonth', () => {
    it('should return 2019-02-21', () => {
      const today = new Date('2019-02-11')

      const thirdThursday = getThirdThursdayOfMonth(today)

      expect(thirdThursday).toBe('2019-02-21')
    })
  })

  describe('isValid', () => {
    it('should return false if date is invalid', () => {
      const invalidDate = new Date('21/02/2019')

      expect(isValid(invalidDate)).toBe(false)
    })

    it('should return true if date is valid', () => {
      const validDate = new Date('2019-02-21')

      expect(isValid(validDate)).toBe(true)
    })
  })

  describe('format', () => {
    it('should return 21/02/2019', () => {
      const isoDate = '2019-02-21'

      expect(format(isoDate)).toBe('21/02/2019')
    })
  })
})
