'use strict'

const { execSync } = require('child_process')

const latestTag = () => execSync('git tag --sort=-creatordate').toString().trim().split('\n')[0]

module.exports = async ({ token, name, tagName, prerelease, draft, body }) => {
  const gitUrl = execSync('git remote get-url origin').toString().trim()
  const regex = /github\.com[:/](.*?)\/(.*?)\.git/
  const [, owner, repo] = gitUrl.match(regex)
  return fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name ?? undefined,
      tag_name: tagName ? tagName.startsWith('v') ? tagName.slice(1) : tagName : latestTag(),
      generate_release_notes: true,
      prerelease,
      draft,
      body
    })
  })
}
