import { BaseCommand } from '../base-command'
import { Flags } from '@oclif/core'

export default class Index extends BaseCommand<typeof Index> {
  static description = 'Retrieve the current story identifier.'

  static examples = [
    '$ story\nSM-123\n'
  ]

  static flags = {
    full: Flags.boolean({
      char: 'f',
      description: 'include both parent and child stories'
    })
  }

  static aliases = ['get']

  async run() {
    const { flags } = await this.parse(Index)
    const { parent, child } = await this.getStory()

    this.log(`${parent} ${flags.full ? child : ''}`.trim())
  }
}
