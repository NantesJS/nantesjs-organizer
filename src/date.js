const startOfMonth = require('date-fns/startOfMonth')
const setDay = require('date-fns/setDay')
const getDay = require('date-fns/getDay')
const addWeeks = require('date-fns/addWeeks')
const format = require('date-fns/format')
const isValid = require('date-fns/isValid')
const isBefore = require('date-fns/isBefore')
const addMonths = require('date-fns/addMonths')
const parseISO = require('date-fns/parseISO')

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

  return format(thirdThursday, 'yyyy-MM-dd')
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

exports.format = date => format(parseISO(date), 'dd/MM/yyyy')
