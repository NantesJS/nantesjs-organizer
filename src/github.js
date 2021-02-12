const { Octokit } = require('@octokit/rest')
const {
  bgGreen,
  bgRed,
  bold,
  green,
  red,
  white,
  yellow,
} = require('kleur')
const { spinner, returnDataAndStopSpinner } = require('./spinner')

const GITHUB_VARIABLES = [
  'GITHUB_TOKEN',
  'GITHUB_WEBSITE',
  'GITHUB_WEBSITE_ORGA',
]

const ENV_VARIABLES = Object.keys(process.env)

const GITHUB_ENABLED = GITHUB_VARIABLES.every(envVar => ENV_VARIABLES.includes(envVar))

exports.GITHUB_ENABLED = GITHUB_ENABLED

let client

if (GITHUB_ENABLED) {
  client = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })
} else {
  console.warn(yellow('⚠️  Les données ne seront pas sauvées sur GitHub :'))
  console.warn(yellow('⚠️  Les variables d\'environnement suivantes ne sonts pas renseignées :'))

  GITHUB_VARIABLES.filter(variable => {
    return ! ENV_VARIABLES.includes(variable)
  }).forEach(missingVariable => {
    console.warn(yellow(`   * ${missingVariable}`))
  })
}

const COMMON_PAYLOAD = {
  owner: process.env.GITHUB_WEBSITE_ORGA,
  repo: process.env.GITHUB_WEBSITE,
}

const MEETUPS_PATH = 'datas/meetups'

const MEETUP_REGEXP = /^meetup-(\d+)\.md$/

function getLastMeetup() {
  if (!client) return

  const spinnerGitHub = spinner(yellow('⏳ Récupération du dernier meetup sur GitHub...')).start()

  return client.repos.getContent({
    ...COMMON_PAYLOAD,
    path: MEETUPS_PATH,
  }).then(contents => {
    const meetups = contents.data.filter(content => MEETUP_REGEXP.test(content.name))
    const [lastMeetup] = meetups.sort().reverse()
    return lastMeetup
  }).then(returnDataAndStopSpinner(spinnerGitHub))
    .catch(error => {
      const messages = [
        red('La récupération de l\'évènement sur GitHub a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        bold().white().bgRed(error),
      ]
      spinnerGitHub.fail(messages.join('\n'))
    })
}

function getMeetupId({ name }) {
  return name.match(MEETUP_REGEXP)[1]
}

function getNextMeetupId(lastMeetup) {
  const lastId = getMeetupId(lastMeetup)
  return parseInt(lastId) + 1
}

function getNextMeetup(lastMeetup) {
  const nextId = getNextMeetupId(lastMeetup)
  const name = `meetup-${nextId}.md`

  return {
    name,
    path: `${MEETUPS_PATH}/${name}`,
  }
}

function getLastMeetupContent({ path }) {
  if (!client) return

  const spinnerGitHub = spinner(yellow('⏳ Récupération du contenu du dernier meetup sur GitHub...')).start()

  return client.repos.getContents({
    ...COMMON_PAYLOAD,
    path,
  }).then(payload => {
    const buffer = Buffer.from(payload.data.content, 'base64')
    return buffer.toString('utf-8')
  }).then(returnDataAndStopSpinner(spinnerGitHub))
    .catch(error => {
       const messages = [
        red('La récupération de l\'évènement sur GitHub a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        bold().white().bgRed(error),
      ]
      spinnerGitHub.fail(messages.join('\n'))
   })
}

function setMeetupStatusDone(content) {
  return content.replace(/status: next/, 'status: done')
}

function createBranchFromMaster(branch) {
  if (!client) return

  const spinnerGitHub = spinner(yellow(`⏳ Création de la branch ${branch} depuis master...`)).start()

  return client.repos
    .getBranch({
      ...COMMON_PAYLOAD,
      branch: 'master',
    })
    .then(branch => branch.data.commit.sha)
    .then(sha => {
      return client.git.createRef({
        ...COMMON_PAYLOAD,
        ref: `refs/heads/${branch}`,
        sha,
      })
    })
    .then(returnDataAndStopSpinner(spinnerGitHub))
    .catch(() => {
      spinnerGitHub.warn(`La branche ${branch} existe déjà`)
    })
}

function updateFile(path, content, branch, message) {
  if (!client) return

  const spinnerGitHub = spinner(yellow(`⏳ Mise à jour du fichier ${path} sur la branche ${branch}...`)).start()

  return client.repos
    .getContents({
      ...COMMON_PAYLOAD,
      path,
      ref: branch,
    })
    .then(content => content.data)
    .catch(() => ({ sha: undefined }))
    .then(({ sha }) => {
      const b64content = Buffer.from(content).toString('base64')

      return client.repos.createOrUpdateFile({
        ...COMMON_PAYLOAD,
        branch,
        path,
        message,
        content: b64content,
        sha,
      })
    })
    .then(returnDataAndStopSpinner(spinnerGitHub))
    .catch(error => {
       const messages = [
        red('La récupération de l\'évènement sur GitHub a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        bold().white().bgRed(error),
      ]
      spinnerGitHub.fail(messages.join('\n'))
    })
}

function createPullRequest(head, title) {
  if (!client) return

  const spinnerGitHub = spinner(yellow(`⏳ Création de la Pull Request...`)).start()

  return client.pulls.create({
    ...COMMON_PAYLOAD,
    base: 'master',
    draft: true,
    head,
    title,
  }).then(payload => {
    const url = payload.data._links.html.href

    const messages = [
      green('🎟  Voici l\'adresse vers la Pull Request :'),
      bold().white().bgGreen(url),
    ]

    spinnerGitHub.succeed(messages.join(' '))
  }).then(returnDataAndStopSpinner(spinnerGitHub))
    .catch(error => {
        const messages = [
        red('La récupération de l\'évènement sur GitHub a échouée... 😱'),
        red('✖ Voici la description de l\'erreur :'),
        bold().white().bgRed(error),
      ]
      spinnerGitHub.fail(messages.join('\n'))
   })
}

async function createWebsiteMeetup(content) {
  if (!client) return

  const lastMeetup = await getLastMeetup()

  const nextMeetup = getNextMeetup(lastMeetup)

  const nextBranch = nextMeetup.name.replace(/\.md$/, '')
  
  await createBranchFromMaster(nextBranch)
  
  const lastMeetupContent = await getLastMeetupContent(lastMeetup).then(setMeetupStatusDone)

  await updateFile(lastMeetup.path, lastMeetupContent, nextBranch, ':wrench: Désactive le dernier meetup')

  await updateFile(nextMeetup.path, content, nextBranch, `:bento: Ajoute ${nextMeetup.name}`)

  await createPullRequest(nextBranch, `:sparkles: Annonce le meetup ${getMeetupId(nextMeetup)}`)
}

exports.createWebsiteMeetup = createWebsiteMeetup

exports.getNextMeetupId = () => {
  if (!client) return

  return getLastMeetup().then(getNextMeetupId)
}
