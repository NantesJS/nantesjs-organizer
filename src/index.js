const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { green, yellow } = require('kleur')
const ora = require('ora')
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
    const spinner = ora(yellow('⏳ Récupération des coordonnées de l\'hébergeur...')).start()

    try {
      writeFileSync(filename, yaml)
      spinner.succeed(green(`🎉 Le meetup a été sauvé dans le fichier suivant : ${filename}`))
    } catch (error) {
      spinner.fail(red(`Une erreur est survenue lors de la sauvegarde du meetup : ${error}`))
    }
  })
