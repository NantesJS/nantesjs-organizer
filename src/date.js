const startOfMonth = require('date-fns/start_of_month')
const setDay = require('date-fns/set_day')
const getDay = require('date-fns/get_day')
const addWeeks = require('date-fns/add_weeks')
const format = require('date-fns/format')
const isValid = require('date-fns/is_valid')
const isBefore = require('date-fns/is_before')
const addMonths = require('date-fns/add_months')

function getNextThirdThursdayOfMonth(date = new Date()) {
  const THURSDAY = 4
  const THIRD = 3 - 1

  const startDateOfMonth = startOfMonth(date)
  const firstThursday = setDay(startDateOfMonth, THURSDAY, {
    weekStartsOn: getDay(startDateOfMonth),
  })
  const thirdThursday = addWeeks(firstThursday, THIRD)

  if (isBefore(thirdThursday, date)) {
    const nextMonth = addMonths(startDateOfMonth, 1)

    return getNextThirdThursdayOfMonth(nextMonth)
  }

  return format(thirdThursday, 'YYYY-MM-DD')
}

exports.getNextThirdThursdayOfMonth = getNextThirdThursdayOfMonth

exports.isValid = (date, today = new Date()) => {
  try {
    const dateToValid = new Date(date)

    if (!isValid(dateToValid)) return false

    return isBefore(today, dateToValid)
  } catch {
    return false
  }
}

exports.format = date => format(date, 'DD/MM/YYYY')
