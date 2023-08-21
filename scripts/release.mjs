import fs from 'fs'
import { toString } from 'mdast-util-to-string'
import path from 'path'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { fileURLToPath } from 'url'

export const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const changelog = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md'), 'utf8')
const pnpm = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
const release = getChangelogEntry(changelog, pnpm.version)
fs.writeFileSync(path.join(__dirname, '../RELEASE.md'), release.content)

function getChangelogEntry(changelog, version) {
  const ast = unified().use(remarkParse).parse(changelog)

  let highestLevel = BumpLevels.dep

  // @ts-expect-error
  const nodes = ast['children'] // eslint-disable-line @typescript-eslint/no-explicit-any
  let headingStartInfo
  let endIndex

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.type === 'heading') {
      const stringified = toString(node)
      const match = stringified.toLowerCase().match(/(major|minor|patch)/)
      if (match !== null) {
        const level = BumpLevels[match[0]]
        highestLevel = Math.max(level, highestLevel)
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        }
        continue
      }
      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i
        break
      }
    }
  }
  if (headingStartInfo != null) {
    // @ts-expect-error
    ast['children'] = ast['children'].slice(
      // eslint-disable-line @typescript-eslint/no-explicit-any
      headingStartInfo.index + 1,
      endIndex,
    )
  }
  return {
    content: `${unified().use(remarkStringify).stringify(ast)}

## Our Gold Sponsors

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://bit.dev/?utm_source=pnpm&utm_medium=release_notes" target="_blank"><img src="https://pnpm.io/img/users/bit.svg" width="80"></a>
      </td>
      <td align="center" valign="middle">
        <a href="https://novu.co/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/novu.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/novu_light.svg" />
            <img src="https://pnpm.io/img/users/novu.svg" width="180" />
          </picture>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://prisma.io/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/prisma.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/prisma_light.svg" />
            <img src="https://pnpm.io/img/users/prisma.svg" width="180" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.flightcontrol.dev/?ref=pnpm" target="_blank"><img src="https://pnpm.io/img/users/flightcontrol.svg" width="240"></a>
      </td>
    </tr>
  </tbody>
</table>

## Our Silver Sponsors

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://leniolabs.com/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <img src="https://pnpm.io/img/users/leniolabs.jpg" width="80">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://vercel.com/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/vercel.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/vercel_light.svg" />
            <img src="https://pnpm.io/img/users/vercel.svg" width="180" />
          </picture>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://depot.dev/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/depot.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/depot_light.svg" />
            <img src="https://pnpm.io/img/users/depot.svg" width="200" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://moonrepo.dev/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/moonrepo.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/moonrepo_light.svg" />
            <img src="https://pnpm.io/img/users/moonrepo.svg" width="200" />
          </picture>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://www.thinkmill.com.au/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/thinkmill.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/thinkmill_light.svg" />
            <img src="https://pnpm.io/img/users/thinkmill.svg" width="200" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://devowl.io/?utm_source=pnpm&utm_medium=release_notes" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/devowlio.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/devowlio.svg" />
            <img src="https://pnpm.io/img/users/devowlio.svg" width="200" />
          </picture>
        </a>
      </td>
    </tr>
  </tbody>
</table>
`,
    highestLevel,
  }
}
