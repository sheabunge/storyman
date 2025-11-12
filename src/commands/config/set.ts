import { Args } from '@oclif/core'
import { BaseCommand } from '../../BaseCommand'
import { USER_CONFIG_SPEC } from '../../utils/config'

export default class ConfigSet extends BaseCommand<typeof ConfigSet> {
  static description = 'Set a new value for a configuration property.'

  static examples = [
    `$ story config set defaultAuthor Shea B
defaultAuthor = Shea B
`
  ]

  static hiddenAliases = ['config:s']

  static strict = false

  static args = {
    prop: Args.string({
      required: true,
      options: Object.keys(USER_CONFIG_SPEC)
    }),
    value: Args.string({
      required: true
    })
  }

  async run() {
    const { args: { prop }, argv: [, ...value] } = await this.parse(ConfigSet)
    const userConfig = await this.userConfig

    if (!userConfig.isValid(prop)) {
      this.error(`invalid property ${prop}`)
    }

    const actualValue = userConfig.set(prop, value.join(' ').trim())

    return userConfig.write().then(() => {
      this.log(`${prop} = ${actualValue}`)
    })
  }
}
