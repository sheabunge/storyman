import { Args } from '@oclif/core'
import { Agent } from 'node:https'
import { BaseCommand } from '../BaseCommand'
import type { JiraStoryInfo } from '../types/JiraStoryInfo'
import type { Story } from '../types/Story'
import type { UserConfigProps } from '../types/UserConfigProps'
import type UserConfig from '../UserConfig'
import { trimTrailingSlash } from '../utils/paths'
import { formatStory } from '../utils/story'
import fetch, { Request } from 'node-fetch-cjs'

const makeStoryInfoRequest = async (story: Story, userConfig: UserConfig<UserConfigProps>): Promise<JiraStoryInfo> => {
  const jiraUrl = trimTrailingSlash(await userConfig.promptFor('jiraUrl'))
  const jiraToken = await userConfig.promptFor('jiraToken')

  const url = `${jiraUrl}/rest/api/latest/issue/${formatStory(story)}?fields=resolution,status,summary,assignee,project`

  const request = new Request(url)
  request.headers.set('Authorization', `Bearer ${jiraToken}`)
  request.headers.set('Accept', 'application/json')

  const agent = new Agent({ rejectUnauthorized: false })

  return <JiraStoryInfo> await (await fetch(request, { agent })).json()
}

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
    const storyInfo = await makeStoryInfoRequest(story, await this.userConfig)

    this.log(`Story:\t\t${storyInfo.key}`)
    this.log(`Project:\t${storyInfo.fields.project.name}`)
    this.log(`Summary:\t${storyInfo.fields.summary}`)
    this.log(`Assignee:\t${storyInfo.fields.assignee ?? 'Unassigned'}`)
    this.log(`Status:\t\t${storyInfo.fields?.status?.name ?? 'Unknown'}`)
  }
}
