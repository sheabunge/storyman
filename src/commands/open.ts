import { Args } from '@oclif/core'
import open from 'open'
import input from '@inquirer/input'
import { BaseCommand } from '../BaseCommand'
import { trimTrailingSlash } from '../utils'

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

  private getBaseUrl = async () => {
    let url = await (await this.userConfig).get('jiraUrl')

    /* eslint-disable no-await-in-loop */
    while (!url) {
      url = await input({ message: 'What is your Jira site URL?', required: true })

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
    const baseUrl = await this.getBaseUrl()

    const story = await this.getStoryIfAvailable()
    const url = story ? `${trimTrailingSlash(baseUrl)}/browse/${story}` : baseUrl

    this.log(`Opening ${url}`)
    await open(url)
  }
}
