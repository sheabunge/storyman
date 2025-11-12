import { BaseCommand } from '../BaseCommand'
import { formatStory } from '../utils/story'

export default class Get extends BaseCommand<typeof Get> {
  static description = 'Retrieve the story identifier from the current Git branch.'

  static examples = [
    '$ story\nSM-12\n'
  ]

  static hiddenAliases = ['']

  async run() {
    await this.parse()
    const story = await this.getStoryOrError()
    this.log(formatStory(story))
  }
}
