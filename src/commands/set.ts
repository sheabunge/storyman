import { Args } from '@oclif/core'
import { BaseCommand } from '../base'

export default class Set extends BaseCommand<typeof Set> {
  static description = 'Set the active story.'

  static examples = [
    `$ story set SM-123
Current story is now SM-123.
`
  ]

  static args = {
    story: Args.string({
      required: true
    }),
    subStory: Args.string({
      description: 'sub story',
      required: false
    })
  }

  async run() {
    const { args: { story, subStory } } = await this.parse(Set)
    await this.setStory(story, subStory)
  }
}
