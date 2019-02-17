const negate = require('lodash/fp/negate')
const isEmpty = require('lodash/fp/isEmpty')

exports.isNotEmpty = negate(isEmpty)
