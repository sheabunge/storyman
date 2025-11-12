import { stat } from 'fs/promises'
import { BaseCommand } from '../../BaseCommand'

export default class ConfigIndex extends BaseCommand<typeof ConfigIndex> {
  public static readonly description = 'Display the list of current configuration properties.'

  public static readonly aliases = ['config:list']

  public static readonly hiddenAliases = ['config:l']

  public static readonly examples = [
    `$ story config
Reading configuration from file:///home/shea/.storyman.json

defaultAuthor = "Shea"
jiraUrl = "https://something.atlassian.net/"
`
  ]

  async run() {
    await this.parse(ConfigIndex)
    const userConfig = await this.userConfig

    try {
      await stat(userConfig.configFile)
      this.log(`Reading configuration from file://${userConfig.configFile}`)
    } catch {
      this.log('Could not find readable configuration file.')
    }

    this.log()

    for (const [prop, value] of Object.entries(await userConfig.getAll())) {
      this.log(`${prop} = ${JSON.stringify(value)}`)
    }
  }
}
