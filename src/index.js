const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { green, yellow } = require('kleur')
const { ask } = require('./questions')
const { generateMarkdown } = require('./template')
const { createEvent } = require('./event')
const { spinner } = require('./spinner')
const { saveEvent } = require('./database')

ask()
  .then(saveEvent)
  .then(createEvent)
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateMarkdown(meetup),
  ]))
  .then(([filename, yaml]) => {
    const spinnerFile = spinner(yellow('⏳ Récupération des coordonnées de l\'hébergeur...')).start()

    try {
      writeFileSync(filename, yaml)
      spinnerFile.succeed(green(`🎉 Le meetup a été sauvé dans le fichier suivant : ${filename}`))
    } catch (error) {
      spinnerFile.fail(red(`Une erreur est survenue lors de la sauvegarde du meetup : ${error}`))
    }
  })
