'use strict'

const test = require('ava')

const { gitDetails } = require('..')

test('.gitDetails', t => {
  t.deepEqual(
    gitDetails({ url: 'git@github.com:kikobeats/github-generate-release.git' }),
    {
      owner: 'kikobeats',
      repo: 'github-generate-release'
    }
  )

  t.deepEqual(
    gitDetails({ url: 'https://github.com/kikobeats/github-generate-release' }),
    {
      owner: 'kikobeats',
      repo: 'github-generate-release'
    }
  )
})
