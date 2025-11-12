export interface JiraStoryInfo {
  id: string
  self: string
  key: string
  fields?: {
    summary: string
    assignee?: string | null
    resolution?: null | {
      self: string
      id: string
      description: string
      name: string
    }
    status?: {
      self: string
      description: string
      iconUrl: string
      name: string
      id: string
      statusCategory: unknown
    }
    project?: {
      self: string
      id: string
      key: string
      name: string
      projectTypeKey: string
      avatarUrls: Record<string, string>
    }
  }
}
