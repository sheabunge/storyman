import { BaseCommand } from '../../base'

export default class ConfigIndex extends BaseCommand<typeof ConfigIndex> {
  static description = 'Display the list of current configuration properties.'

  static aliases = ['config:list', 'config:l']

  static examples = [
    `$ story config
defaultAuthor = "Shea"
defaultProject = "SM"
jiraUrl = "https://something.atlassian.net/"
projects = "SM EG ETC"
`
  ]

  async run() {
    const userConfig = await this.userConfig

    for (const [prop, value] of Object.entries(await userConfig.getAll())) {
      this.log(`${prop} = ${JSON.stringify(value)}`)
    }
  }
}
