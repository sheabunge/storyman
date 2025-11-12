import fetch, { Request } from 'node-fetch'
import { Agent } from 'node:https'
import type { JiraStoryInfo } from '../types/JiraStoryInfo'
import type { Story } from '../types/Story'
import { trimTrailingSlash } from './paths'
import { formatStory } from './story'

const PEEK_TIMEOUT_MS = 2000

export interface StoryInfoRequestArgs {
  story: Story
  fields: Array<'resolution' | 'status' | 'summary' | 'assignee' | 'project'>
  jiraUrl: string
  jiraToken: string
}

export const makeStoryInfoRequest = async ({
  story,
  fields,
  jiraUrl,
  jiraToken
}: StoryInfoRequestArgs): Promise<JiraStoryInfo | undefined> => {
  const agent = new Agent({ rejectUnauthorized: false })

  try {
    await fetch(jiraUrl, { method: 'HEAD', agent, signal: AbortSignal.timeout(PEEK_TIMEOUT_MS) })
  } catch {
    return undefined
  }

  const url = `${trimTrailingSlash(jiraUrl)}/rest/api/latest/issue/${formatStory(story)}?fields=${fields.join(',')}`

  const request = new Request(url)
  request.headers.set('Authorization', `Bearer ${jiraToken}`)
  request.headers.set('Accept', 'application/json')

  return <JiraStoryInfo> await (await fetch(request, { agent })).json()
}
