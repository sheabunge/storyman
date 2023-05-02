import { Args } from '@oclif/core'
import { BaseCommand } from '../base'

export default class Set extends BaseCommand<typeof Set> {
  static description = 'Set the active story.'

  static examples = [
    `$ story set SM-12
Current story is now SM-12.
`,
    `$ story set SM-12 SM-34
Current story is now SM-12 SM-34.
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
    const { args: { story: parent, subStory: child } } = await this.parse(Set)
    await this.setStory({ parent, child })
  }
}
