import { BaseCommand } from '../base'
import { Flags } from '@oclif/core'

export default class Clear extends BaseCommand<typeof Clear> {
  static description = 'Reset the current story identifier.'

  static examples = [
    '$ story clear\n'
  ]

  static aliases = ['unset', 'reset']

  async run() {
    await this.clearStory()
      .then(() => this.getStory())
      .then(story =>
        story ?
          this.error(`Could not clear story file. Current story is ${story}.`) :
          this.log('Current story has been cleared.')
      )
  }
}
