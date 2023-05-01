import { ux } from '@oclif/core'
import { BaseCommand } from '../base'
import open from 'open'
import { trimTrailingSlash } from '../utils'

export default class Open extends BaseCommand<typeof Open> {
  static description = 'Open the active story in Jira.'

  static examples = [
    '$ story open'
  ]

  static aliases = ['jira']

  private getBaseUrl = async () => {
    let url = await (await this.userConfig).get('jiraUrl')

    while (!url) {
      url = await ux.prompt('What is your Jira site URL?')

      if (!url.toLowerCase().startsWith('http')) {
        this.warn("That doesn't appear to be a valid URL.")
        url = ''
      } else {
        const userConfig = await this.userConfig
        userConfig.set('jiraUrl', url)
        await userConfig.write()
      }
    }

    return url
  }

  async run() {
    const story = await this.getStory()
    const baseUrl = await this.getBaseUrl()

    const url = `${trimTrailingSlash(baseUrl)}/browse/${story.child ?? story.parent}`

    this.log(`Opening ${url}`)
    await open(url)
  }
}
