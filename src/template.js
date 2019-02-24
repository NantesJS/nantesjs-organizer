const handlebars = require('handlebars')

exports.generateMarkdown = handlebars.compile(`---
id: {{id}}
status: next
title: '{{title}}'
date: '{{date}}'
image: NOT_IMPLEMENTED_YET
ticketsUrl: {{ticketsUrl}}
venue:
  id: {{venue.id}}
  name: '{{venue.name}}'
  link: '{{venue.link}}'
  postal_code: {{venue.postal_code}}
  address: {{venue.address}}
  city: {{venue.city}}
  latitude: {{venue.lat}}
  longitude: {{venue.lng}}
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
