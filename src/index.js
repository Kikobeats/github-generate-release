'use strict'

const { execSync } = require('child_process')

const latestTag = () => execSync('git tag --sort=-creatordate').toString().trim().split('\n')[0]

const gitDetails = (opts) => {
  if (opts.owner && opts.repo) return opts
  const gitUrl = execSync('git remote get-url origin').toString().trim()
  const regex = /github\.com[:/](.*?)\/(.*?)\.git/
  const [, owner, repo] = gitUrl.match(regex)
  return { owner, repo }
}

module.exports = async ({ token, name, tagName, prerelease, draft, body, ...opts }) => {
  const { owner, repo } = gitDetails(opts)

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name ?? undefined,
      tag_name: tagName ?? latestTag(),
      generate_release_notes: true,
      prerelease,
      draft,
      body
    })
  })

  const payload = await response.json()

  if (!response.ok) {
    const error = new Error(`${payload.message} – See ${payload.documentation_url}`)
    error.name = 'GitHubError'
    throw error
  }

  return payload
}
