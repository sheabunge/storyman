import { Story } from '../types/story'

export const formatStory = (story: Story | undefined, defaultProject?: string): string =>
  story ?
    Object.values(story)
      .map(tag => tag && defaultProject ? prefixStory(defaultProject, tag) : tag)
      .filter(Boolean)
      .join(' ') :
    ''

export const prefixStory = (prefix: string, suffix: string): string =>
  /^\d+$/.test(suffix) ? `${prefix}-${suffix}` : suffix

export const splitStory = (story: string): [string, string] =>
  story.split('-', 1) as [string, string]
