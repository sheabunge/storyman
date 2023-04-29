import { Args } from '@oclif/core'
import { BaseCommand } from '../../base'

export default class ConfigSet extends BaseCommand<typeof ConfigSet> {
  static description = 'set a new value for a configuration property'

  static examples = [
    '$ story config set defaultProject SM'
  ]

  static aliases = ['config:s']

  static args = {
    prop: Args.string({ required: true }),
    value: Args.string({ required: true })
  }

  async run() {
    const { args: { prop, value } } = await this.parse(ConfigSet)

    if (!this.userConfig.isValid(prop)) {
      this.error(`invalid property ${prop}`)
    }

    await this.userConfig.set(prop, value)
    await this.userConfig.write()
  }
}
