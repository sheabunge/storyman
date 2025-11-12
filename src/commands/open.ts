import { Args } from '@oclif/core'
import open from 'open'
import { BaseCommand } from '../BaseCommand'
import { formatStory } from '../utils/story'
import { trimTrailingSlash } from '../utils/paths'

export default class Open extends BaseCommand<typeof Open> {
  static aliases = ['jira']

  static description = 'Open the active story in Jira.'

  static examples = [
    `$ story open
Opening https://something.atlassian.net/browse/SM-12
`,
    `$ story open 42
Opening https://something.atlassian.net/browse/SM-42
`,
    `$ story open TS-19
Opening https://something.atlassian.net/browse/TS-19
`
  ]

  static args = {
    story: Args.string({
      required: false,
      description: 'Open this story, instead of the current story.'
    })
  }

  async run() {
    const { args } = await this.parse(Open)

    const story = await this.getStoryWithFallback(args.story)
    const baseUrl = await (await this.userConfig).promptFor('jiraUrl')

    const url = story ? `${trimTrailingSlash(baseUrl)}/browse/${formatStory(story)}` : baseUrl

    this.log(`Opening ${url}`)
    await open(url)
  }
}
