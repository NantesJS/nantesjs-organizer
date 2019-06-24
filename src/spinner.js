const ora = require('ora')

exports.spinner = text => ora(text)

exports.returnDataAndStopSpinner = spinner => data => {
  spinner.stop()
  return data
}
