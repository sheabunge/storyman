import { stat } from 'fs/promises'
import { BaseCommand } from '../BaseCommand'
import { formatStory } from '../utils'

export default class Get extends BaseCommand<typeof Get> {
  static description = 'View information about the current story environment.'

  static examples = [
    `$ story info
Current story is SM-123.
   
Reading configuration from /home/shea/.storyman.json.
`
  ]

  async run() {
    const story = await this.getStory()
    const userConfig = await this.userConfig

    this.log(`Current story is ${formatStory(story) ?? 'not set'}.`)

    this.log()

    try {
      await stat(userConfig.configFile)
      this.log(`Reading configuration from ${userConfig.configFile}.`)
    } catch {
      this.log('Could not find readable configuration file.')
    }
  }
}
