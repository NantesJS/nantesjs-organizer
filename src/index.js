const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { green } = require('kleur') 
const { ask } = require('./questions')
const { generateMarkdown } = require('./template')

ask()
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateMarkdown(meetup),
  ]))
  .then(([filename, yaml]) => {
    writeFileSync(filename, yaml)
    console.log(green(`🎉 Generated ${filename}`))
  })
