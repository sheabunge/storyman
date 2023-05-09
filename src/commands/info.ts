import { BaseCommand } from '../base'

export default class Get extends BaseCommand<typeof Get> {
  static description = 'View information about the current story environment.'

  static examples = [
    `$ story info
Current story is SM-123
Current child story is SM-134
   
Reading story from /home/shea/.story
Reading configuration from /home/shea/.storyman.json
`
  ]

  async run() {
    const story = await this.getStory()
    const storyFile = await this.storyFile
    const userConfig = await this.userConfig

    this.log(`Current story is ${story?.parent ?? 'not set.'}`)

    if (story?.child) {
      this.log(`Current child story is ${story.child}`)
    }

    this.log()
    this.log(`Reading story from ${storyFile}`)
    this.log(`Reading configuration from ${userConfig.configFile}`)
  }
}
