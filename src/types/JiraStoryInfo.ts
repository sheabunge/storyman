export interface JiraStoryInfo {
  expand: string
  id: string
  self: string
  key: string
  fields: JiraStoryFields
}

export interface JiraStoryFields {
  summary?: string
  project?: {
    self: string
    id: string
    key: string
    name: string
    projectTypeKey: string
    avatarUrls: {
      '48x48': string
      '24x24': string
      '16x16': string
      '32x32': string
    }
  }
  assignee?: null | {
    self: string
    name: string
    key: string
    emailAddress: string
    avatarUrls: {
      '48x48': string
      '24x24': string
      '16x16': string
      '32x32': string
    }
    displayName: string
    active: boolean
    timeZone: string
  }
  resolution?: null | {
    self: string
    id: string
    description: string
    name: string
  }
  status?: null | {
    self: string
    description: string
    iconUrl: string
    name: string
    id: string
    statusCategory: {
      self: string
      id: number
      key: string
      colorName: string
      name: string
    }
  }
}
