import { Story } from '../types/story'

export const formatStory = (story: Story, defaultProject?: string): string =>
  Object.values(story)
    .map(tag => tag && defaultProject ? prefixStory(defaultProject, tag) : tag)
    .filter(Boolean)
    .join(' ')

export const prefixStory = (prefix: string, suffix: string): string =>
  /^\d+$/.test(suffix) ? `${prefix}-${suffix}` : suffix

export const splitStory = (story: string): [string, string] =>
  story.split('-', 1) as [string, string]
