import { Args } from '@oclif/core'
import { BaseCommand } from '../../base'

export default class ConfigUnset extends BaseCommand<typeof ConfigUnset> {
  static description = 'reset a configuration property to its default value'

  static examples = [
    '$ story config unset defaultProject'
  ]

  static aliases = ['clear', 'remove', 'delete', 'del', 'rm', 'd']
    .map(alias => `config:${alias}`)

  static args = {
    prop: Args.string({
      name: 'prop',
      required: true
    })
  }

  async run() {
    const { args: { prop } } = await this.parse(ConfigUnset)

    if (!this.userConfig.isValid(prop)) {
      this.error(`invalid property ${prop}`)
    }

    await this.userConfig.unset(prop)
    await this.userConfig.write()
  }
}
