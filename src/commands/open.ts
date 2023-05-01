import { Args, ux } from '@oclif/core'
import * as open from 'open'
import { BaseCommand } from '../base-command'
import { prefixStory, trimTrailingSlash } from '../utils'

export default class Open extends BaseCommand<typeof Open> {
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

  static aliases = ['jira']

  static args = {
    story: Args.string({
      required: false,
      description: 'Open this story, instead of the current story.'
    })
  }

  private getBaseUrl = async () => {
    let url = await (await this.userConfig).get('jiraUrl')

    /* eslint-disable no-await-in-loop */
    while (!url) {
      url = await ux.prompt('What is your Jira site URL?', { required: true })

      if (!url || !url.toLowerCase().startsWith('http')) {
        this.warn('That doesn\'t appear to be a valid URL.')
        url = ''
        continue
      }

      const userConfig = await this.userConfig
      userConfig.set('jiraUrl', url)
      await userConfig.write()
    }
    /* eslint-enable no-await-in-loop */

    return url
  }

  async run() {
    const { args: { story: storyOverride } } = await this.parse(Open)
    const baseUrl = await this.getBaseUrl()

    const story = await (async (): Promise<string> => {
      if (storyOverride) {
        const defaultProject = await (await this.userConfig).get('defaultProject')
        return prefixStory(defaultProject, storyOverride)
      }

      const story = await this.getStory()
      return story.child ?? story.parent
    })()

    const url = `${trimTrailingSlash(baseUrl)}/browse/${story}`

    this.log(`Opening ${url}`)
    await open(url)
  }
}
