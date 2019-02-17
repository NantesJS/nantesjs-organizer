const startOfMonth = require('date-fns/start_of_month')
const setDay = require('date-fns/set_day')
const getDay = require('date-fns/get_day')
const addWeeks = require('date-fns/add_weeks')
const format = require('date-fns/format')
const isValid = require('date-fns/is_valid')

exports.getThirdThursdayOfMonth = (date = new Date()) => {
  const THURSDAY = 4
  const THIRD = 3 - 1

  const startDateOfMonth = startOfMonth(date)
  const firstThursday = setDay(startDateOfMonth, THURSDAY, {
    weekStartsOn: getDay(startDateOfMonth),
  })
  const thirdThursday = addWeeks(firstThursday, THIRD)

  return format(thirdThursday, 'YYYY-MM-DD')
}

exports.isValid = date => {
  try {
    return isValid(new Date(date))
  } catch {
    return false
  }
}

exports.format = date => format(date, 'DD/MM/YYYY')
