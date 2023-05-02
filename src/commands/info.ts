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
    const { parent, child } = await this.getStory()
    const storyFile = await this.storyFile
    const userConfig = await this.userConfig

    this.log(`Current story is ${parent}`)

    if (child) {
      this.log(`Current child story is ${child}`)
    }

    this.log()
    this.log(`Reading story from ${storyFile}`)
    this.log(`Reading configuration from ${userConfig.configFile}`)
  }
}
