import { Story } from '../types/story'

export const formatStory = (story: Story) =>
  Object.values(story).filter(Boolean).join(' ')
