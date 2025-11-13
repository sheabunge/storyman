import fetch, { Headers, RequestInit } from 'node-fetch'
import { Agent } from 'node:https'
import type { JiraSearchResults } from '../types/JiraSearchResults'
import type { JiraStoryFields, JiraStoryInfo } from '../types/JiraStoryInfo'
import type { Story } from '../types/Story'
import { trimTrailingSlash } from './paths'
import { formatStory } from './story'

const PEEK_TIMEOUT_MS = 2000

const initRequest = async ({ jiraUrl, jiraToken }: RequestArgsBase): Promise<RequestInit | undefined> => {
  const agent = new Agent({ rejectUnauthorized: false })

  try {
    await fetch(jiraUrl, { method: 'HEAD', agent, signal: AbortSignal.timeout(PEEK_TIMEOUT_MS) })
  } catch {
    return undefined
  }

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${jiraToken}`)
  headers.set('Accept', 'application/json')

  return { headers, agent }
}

export interface RequestArgsBase {
  jiraUrl: string
  jiraToken: string
}

export interface StoryInfoRequestArgs extends RequestArgsBase {
  story: Story
  fields: (keyof JiraStoryFields)[]
}

export const makeStoryInfoRequest = async ({
  story,
  fields,
  jiraUrl,
  jiraToken
}: StoryInfoRequestArgs): Promise<JiraStoryInfo | undefined> => {
  const requestInit = await initRequest({ jiraUrl, jiraToken })

  if (!requestInit) {
    return undefined
  }

  const params = new URLSearchParams()
  params.set('fields', fields.join(','))

  const url = `${trimTrailingSlash(jiraUrl)}/rest/api/latest/issue/${formatStory(story)}?${params.toString()}`

  return <JiraStoryInfo> await (await fetch(url, requestInit)).json()
}

export interface SearchRequestArgs extends RequestArgsBase {
  jql: string
  fields: (keyof JiraStoryFields)[]
}

export const makeSearchRequest = async ({
  jql,
  fields,
  jiraUrl,
  jiraToken
}: SearchRequestArgs): Promise<JiraSearchResults | undefined> => {
  const requestInit = await initRequest({ jiraUrl, jiraToken })

  if (!requestInit) {
    return undefined
  }

  const params = new URLSearchParams()
  params.set('jql', jql)
  params.set('fields', fields.join(','))

  const url = `${trimTrailingSlash(jiraUrl)}/rest/api/latest/search?${params.toString()}`

  return <JiraSearchResults> await (await fetch(url, requestInit)).json()
}
