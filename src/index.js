const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { ask } = require('./questions')
const { generateMarkdown } = require('./template')

ask(prompts)
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateMarkdown(meetup),
  ]))
  .then(([filename, yaml]) => {
    writeFileSync(filename, yaml)
    console.log(`Generated ${filename} 🎉`)
  })
