import { BaseCommand } from '../base'
import { Flags } from '@oclif/core'

export default class Get extends BaseCommand<typeof Get> {
  static description = 'Retrieve the current story identifier.'

  static examples = [
    '$ story\nSM-12\n',
    '$ story -f\nSM-12 SM-34\n'
  ]

  static flags = {
    full: Flags.boolean({
      char: 'f',
      description: 'include both parent and child stories'
    })
  }

  static aliases = ['']

  async run() {
    const { flags } = await this.parse(Get)
    const { parent, child } = await this.getStory()

    this.log(`${parent} ${flags.full ? child : ''}`.trim())
  }
}
