'use strict'

const gitDetails = opts => {
  if (opts.owner && opts.repo) return opts
  const regex = /github\.com[:/](.*?)\/(.*?)\.git/
  const [, owner, repo] = opts.url.match(regex)
  return { owner, repo }
}

const createGithubAPI =
  token =>
    async (url, { headers, ...opts } = {}) => {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          ...headers
        },
        ...opts
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const error = new Error(
        `${payload?.message} – See ${payload?.documentation_url}`
        )
        error.name = 'GitHubError'
        throw error
      }

      return payload
    }

module.exports = async ({
  token,
  name,
  tagName,
  prerelease,
  draft,
  body,
  ...opts
}) => {
  const { owner, repo } = gitDetails(opts)
  const githubAPI = createGithubAPI(token)
  return githubAPI(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    body: JSON.stringify({
      name: name ?? undefined,
      tag_name: tagName,
      generate_release_notes: true,
      prerelease,
      draft,
      body
    })
  })
}

module.exports.gitDetails = gitDetails
