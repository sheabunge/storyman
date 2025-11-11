import type { Story } from '../types/Story'

export const formatStory = (story: Story): string =>
  `${story.project}-${story.number}`
