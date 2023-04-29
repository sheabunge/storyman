import { BaseCommand } from '../base'
import open from 'open'

export default class Open extends BaseCommand<typeof Open> {
  static description = 'Open the active story in Jira.'

  static examples = [
    '$ story open'
  ]

  static aliases = ['jira']

  async run() {
    const story = await this.getStory()
    const baseUrl = this.userConfig.get('jiraUrl')

    if (!baseUrl) {
      this.error('Please set the jiraUrl config property to use this command.')
      return
    }

    const url = `${baseUrl}/browse/${story}`
    this.log(`Opening ${url}`)
    await open(url)
  }
}
