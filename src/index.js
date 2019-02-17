const { writeFileSync } = require('fs')
const prompts = require('prompts')
const { ask } = require('./questions')
const { generateYaml } = require('./template')

ask(prompts)
  .then(meetup => ([
    `meetup-${meetup.id}.md`,
    generateYaml(meetup),
  ]))
  .then(([filename, yaml]) => {
    writeFileSync(filename, yaml)
    console.log(`Generated ${filename} 🎉`)
  })
