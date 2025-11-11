import { BaseCommand } from '../BaseCommand'
import { formatStory } from '../utils'

export default class Get extends BaseCommand<typeof Get> {
  static description = 'Retrieve the story identifier from the current Git branch.'

  static examples = [
    '$ story\nSM-12\n'
  ]

  static aliases = ['']

  async run() {
    await this.parse()
    const story = await this.getStory()
    this.log(formatStory(story))
  }
}
