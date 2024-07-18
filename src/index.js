'use strict'

const gitDetails = opts => {
  if (opts.owner && opts.repo) return opts

  const regex =
    /(?:git@github\.com:|https:\/\/github\.com\/)(.*?)\/(.*?)(?:\.git)?$/
  const match = opts.url.match(regex)

  if (match) {
    const [, owner, repo] = match
    return { owner, repo }
  }

  throw new TypeError(`Invalid git url: ${opts.url}`)
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
        const code = payload?.errors[0]?.code
        let message = payload?.message
        if (code) message += ` (${code})`
        message += ` – See ${payload?.documentation_url}`
        const error = new Error(message)
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
    redirect: 'manual',
    method: 'POST',
    body: JSON.stringify({
      name,
      tag_name: tagName,
      generate_release_notes: true,
      prerelease,
      draft,
      body
    })
  })
}

module.exports.gitDetails = gitDetails
