import figures from '@inquirer/figures'
import { Args } from '@oclif/core'
import { green } from 'yoctocolors-cjs'
import { BaseCommand } from '../BaseCommand'
import { makeStoryInfoRequest } from '../utils/jira'

export default class Info extends BaseCommand<typeof Info> {
  static description = 'View information about a story.'

  static examples = [
    `$ story info
Current story is SM-123: Example story name.
`
  ]

  static args = {
    story: Args.string({
      required: false,
      description: 'Fetch information for this story, instead of the current story.'
    })
  }

  async run() {
    const { args } = await this.parse(Info)

    const story = await this.getStoryWithFallback(args.story)
    const storyInfo = await makeStoryInfoRequest(await this.userConfig, story, ['resolution', 'status', 'summary', 'assignee', 'project'])

    if (!storyInfo) {
      this.error('Failed to fetch story information from Jira. Please check your Jira configuration and network connectivity.')
    }

    this.log(`Current story is ${storyInfo.key}${storyInfo.fields.resolution ? ` ${green(figures.tick)}` : ''}`)
    this.log()
    this.log(`Project:\t${storyInfo.fields.project.name}`)
    this.log(`Summary:\t${storyInfo.fields.summary}`)
    this.log(`Assignee:\t${storyInfo.fields.assignee ?? 'Unassigned'}`)
    this.log(`Status:\t\t${storyInfo.fields?.status?.name ?? 'Unknown'}`)
  }
}
