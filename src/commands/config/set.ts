import { Args } from '@oclif/core'
import { BaseCommand } from '../../base'

export default class ConfigSet extends BaseCommand<typeof ConfigSet> {
  static description = 'Set a new value for a configuration property.'

  static examples = [
    `$ story config set defaultProject SM
defaultProject = SM
`
  ]

  static aliases = ['config:s']
  static strict = false

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
