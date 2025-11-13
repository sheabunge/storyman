import figures from '@inquirer/figures'
import { Args } from '@oclif/core'
import { green } from 'yoctocolors-cjs'
import { BaseCommand } from '../BaseCommand'
import { makeStoryInfoRequest } from '../utils/jira'
import { printTable } from '../utils/text'

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

    const userConfig = await this.userConfig
    const story = await this.getStoryWithFallback(args.story)

    const storyInfo = await makeStoryInfoRequest({
      story,
      jiraUrl: await userConfig.promptFor('jiraUrl'),
      jiraToken: await userConfig.promptFor('jiraToken'),
      fields: ['resolution', 'status', 'summary', 'assignee', 'project']
    })

    if (!storyInfo) {
      this.error('Failed to fetch story information from Jira. Please check your Jira configuration and network connectivity.')
    }

    const { project, assignee, status, resolution, summary } = storyInfo.fields

    this.log(`Current story is ${storyInfo.key}${resolution ? ` ${green(figures.tick)}` : ''}`)
    this.log()

    const table = [
      ['Project:', project.name],
      ['Summary:', summary],
      ['Assignee:', assignee ? `${assignee.displayName} (${assignee.name})` : 'Unassigned'],
      ['Status:', status?.name ?? 'Unknown']
    ]

    printTable(table, row => {
      this.log(row)
    })
  }
}
