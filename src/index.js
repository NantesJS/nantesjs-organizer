const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { green } = require('kleur') 
const { ask } = require('./questions')
const { generateMarkdown } = require('./template')
const { createEvent } = require('./event')

ask()
  .then(createEvent)
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateMarkdown(meetup),
  ]))
  .then(([filename, yaml]) => {
    writeFileSync(filename, yaml)
    console.log(green(`🎉 Le meetup a été sauvé dans le fichier suivant : ${filename}`))
  })
