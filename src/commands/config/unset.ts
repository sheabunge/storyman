import { Args } from '@oclif/core'
import { BaseCommand } from '../../BaseCommand'
import { USER_CONFIG_SPEC } from '../../utils/config'

const prefixAliases = (...aliases: string[]) =>
  aliases.map(alias => `config:${alias}`)

export default class ConfigUnset extends BaseCommand<typeof ConfigUnset> {
  static description = 'Reset a configuration property to its default value.'

  static examples = [
    '$ story config unset defaultAuthor'
  ]

  static aliases = prefixAliases('clear')

  static hiddenAliases = prefixAliases('remove', 'delete', 'del', 'rm', 'd')

  static args = {
    prop: Args.string({
      name: 'prop',
      required: true,
      options: Object.keys(USER_CONFIG_SPEC)
    })
  }

  async run() {
    const { args: { prop } } = await this.parse(ConfigUnset)
    const userConfig = await this.userConfig

    if (!userConfig.isValid(prop)) {
      this.error(`invalid property ${prop}`)
    }

    await userConfig.unset(prop)
    await userConfig.write()
  }
}
