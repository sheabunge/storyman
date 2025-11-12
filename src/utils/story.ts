import type { Story } from '../types/Story'

export const STORY_RE = /^(:?(?<project>[A-Z]+)-)?(?<number>\d+)/

export const formatStory = (story: Story): string =>
  `${story.project}-${story.number}`

export const parseStory = (storyTag: string, fallbackProject?: string): Story | undefined => {
  const match = STORY_RE.exec(storyTag)

  const number = match?.groups?.number ? Number(match.groups.number) : undefined
  const project = match?.groups?.project ?? fallbackProject

  return project && number ? { project, number } : undefined
}
