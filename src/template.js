const handlebars = require('handlebars')

exports.generateYaml = handlebars.compile(`
---
id: {{id}}
status: next
title: '{{title}}'
date: '{{date}}'
image: NOT_IMPLEMENTED_YET
ticketsUrl: NOT_IMPLEMENTED_YET
venue:
  id: {{venue.id}}
  name: '{{venue.name}}'
  link: '{{venue.link}}'
  postal_code: NOT_IMPLEMENTED_YET
  address: NOT_IMPLEMENTED_YET
  city: NOT_IMPLEMENTED_YET
  latitude: NOT_IMPLEMENTED_YET
  longitude: NOT_IMPLEMENTED_YET
sponsor:
    id: {{sponsor.id}}
    name: '{{sponsor.name}}'
    link: '{{sponsor.link}}'
talks:
  {{#each talks}}
  -
    id: {{id}}
    title: '{{title}}'
    description: '{{description}}'
    speakers:
    {{#each speakers}}
      -
          id: {{id}}
          name: '{{name}}'
          link: '{{link}}'
    {{/each}}
  {{/each}}
`)
