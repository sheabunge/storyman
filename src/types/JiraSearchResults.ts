import type { JiraStoryInfo } from './JiraStoryInfo'

export interface JiraSearchResults {
  expand: string
  startAt: number
  maxResults: number
  total: number
  issues: JiraStoryInfo[]
}
