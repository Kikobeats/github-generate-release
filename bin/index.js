#!/usr/bin/env node

const { execSync } = require('child_process')
const mri = require('mri')

const { _, ...flags } = mri(process.argv.slice(2), {
  default: {
    token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
    url: execSync('git remote get-url origin').toString().trim(),
    tagName: execSync('git tag --sort=-creatordate')
      .toString()
      .trim()
      .split('\n')[0]
  }
})

console.log('DEBUG url', flags.url)

if (flags.help) {
  console.log(require('fs').readFileSync('./help.txt', 'utf8'))
  process.exit(0)
}

if (!flags.token) {
  console.log(
    '\nA GitHub token with `public_repo` permission needs to be provided.'
  )
  console.log(
    'It should be exposed via `process.env.GH_TOKEN` or `process.env.GITHUB_TOKEN`.'
  )
}

Promise.resolve(require('..')(flags))
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
