import figures from '@inquirer/figures'
import { cyan } from 'yoctocolors-cjs'
import { BaseCommand } from '../BaseCommand'
import { makeSearchRequest } from '../utils/jira'
import { formatStory } from '../utils/story'
import { printTable } from '../utils/text'

export default class List extends BaseCommand<typeof List> {
  static description = 'List stories assigned to the current Jira user.'

  async run() {
    await this.parse(List)

    const userConfig = await this.userConfig

    const response = await makeSearchRequest({
      jiraUrl: await userConfig.promptFor('jiraUrl'),
      jiraToken: await userConfig.promptFor('jiraToken'),
      jql: 'assignee=currentUser() ORDER BY created DESC',
      fields: ['summary', 'resolution', 'assignee', 'status']
    })

    if (!response) {
      this.error('Failed to fetch story information from Jira. Please check your Jira configuration and network connectivity.')
    }

    const table: string[][] = []

    for (const issue of response.issues) {
      if (!issue.fields.resolution) {
        table.push([issue.key, issue.fields.summary, `(${issue.fields.status.name})`])
      }
    }

    const story = await this.getStoryIfAvailable()
    const storyTag = story ? formatStory(story) : undefined

    this.log('Stories assigned to you:')

    printTable(table, line => {
      const output = `${figures.pointer} ${line}`
      this.log(line.startsWith(storyTag) ? cyan(output) : output)
    })
  }
}
