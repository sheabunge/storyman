import { BaseCommand } from '../../BaseCommand'

export default class ConfigIndex extends BaseCommand<typeof ConfigIndex> {
  public static readonly description = 'Display the list of current configuration properties.'

  public static readonly aliases = ['config:list']

  public static readonly hiddenAliases = ['config:l']

  public static readonly examples = [
    `$ story config
defaultAuthor = "Shea"
jiraUrl = "https://something.atlassian.net/"
`
  ]

  async run() {
    const userConfig = await this.userConfig

    for (const [prop, value] of Object.entries(await userConfig.getAll())) {
      this.log(`${prop} = ${JSON.stringify(value)}`)
    }
  }
}
