const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { ask } = require('./questions')
const { generateMarkdown } = require('./template')

ask()
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateMarkdown(meetup),
  ]))
  .then(([filename, yaml]) => {
    writeFileSync(filename, yaml)
    console.log(`Generated ${filename} 🎉`)
  })
