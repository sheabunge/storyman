import { Args } from '@oclif/core'
import { BaseCommand } from '../../base'
import { UserConfigProps } from '../../types/userConfigProps'

const parseBoolean = (value: unknown) => !(
  !value ||
  typeof value === 'string' && ('0' === value || 'false' === value.toLowerCase() || 'no' === value.toLowerCase())
)

const booleanProperties: Array<keyof UserConfigProps> = ['requireAuthor', 'requireStory']

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

    const actualValue = booleanProperties.includes(prop) ? parseBoolean(value) : value

    this.userConfig.set(prop, actualValue)

    return this.userConfig.write().then(() => {
      this.log(`${prop} = ${actualValue}`)
    })
  }
}
