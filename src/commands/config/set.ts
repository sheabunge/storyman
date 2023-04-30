import { Args } from '@oclif/core'
import { BaseCommand } from '../../base'

export default class ConfigSet extends BaseCommand<typeof ConfigSet> {
  static description = 'Set a new value for a configuration property.'

  static examples = [
    '$ story config set defaultProject SM'
  ]

  static aliases = ['config:s']

  static args = {
    prop: Args.string({
      required: true,
      options: Object.keys(BaseCommand.userConfigDefaults)
    }),
    value: Args.string({
      required: true
    })
  }

  async run() {
    const { args: { prop, value } } = await this.parse(ConfigSet)

    if (!this.userConfig.isValid(prop)) {
      this.error(`invalid property ${prop}`)
    }

    this.userConfig.set(prop, value)

    return this.userConfig.write().then(() => {
      this.log(`${prop} config property is now ${value}.`)
    })
  }
}
