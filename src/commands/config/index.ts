import { BaseCommand } from '../../base'

export default class ConfigIndex extends BaseCommand<typeof ConfigIndex> {
  static description = 'Display the list of current configuration properties.'

  static aliases = ['config:list', 'config:l']

  async run() {
    for (const [prop, value] of Object.entries(await this.userConfig.getAll())) {
      this.log(`${prop} = ${JSON.stringify(value)}`)
    }
  }
}
