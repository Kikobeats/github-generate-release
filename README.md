# github-generate-release

![Last version](https://img.shields.io/github/tag/kikobeats/github-generate-release.svg?style=flat-square)
[![NPM Status](https://img.shields.io/npm/dm/github-generate-release.svg?style=flat-square)](https://www.npmjs.org/package/github-generate-release)

**github-generate-release** is the simplest way to create a GitHub Release.

<div align="center">
  <img src="https://github.com/Kikobeats/github-generate-release/raw/media/light.png#gh-light-mode-only">
  <img src="https://github.com/Kikobeats/github-generate-release/raw/media/dark.png#gh-dark-mode-only">
  <br>
  <br>
</div>

It needs a GitHub token with `public_repo` permission, exposed as `GH_TOKEN` or `GITHUB_TOKEN` (see [example](https://github.com/Kikobeats/github-generate-release/blob/5a9db649b79ed0bb01194413e1dcc4818e82d155/.github/workflows/main.yml#L63)).

Just call it and it will release the latest git tag created:

```sh
npx github-generate-release
```

That makes easy integrate it as part of a release workflow:

```json
{
  "release": "standard-version -a",
  "postrelease": "npm run release:tags && npm run release:github && npm publish",
  "release:tags": "git push --follow-tags origin HEAD:master",
  "release:github": "github-generate-release",
}
```

You can pass any flag supported by [GitHub API release endpoint](https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release):

```sh
npx github-generate-release --draft
```

Alternatively, it can be used as Node.js module:

```js
const release = require('github-generate-release')

await release({ draft: true })
```

## License

**github-generate-release** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/github-generate-release/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/github-generate-release/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
