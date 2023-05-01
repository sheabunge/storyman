import { homedir } from 'os'
import { resolve } from 'path'

export const STORY_FILENAME = '.story'
export const USER_CONFIG_FILENAME = '.storyman.json'

export const expandPath = (filename: string): string =>
  resolve(filename.replace(/^~/, homedir()))

export const trimLeadingSlash = (path: string): string =>
  '/' === path.charAt(0) ? path.slice(1) : path

export const trimTrailingSlash = (path: string): string =>
  '/' === path.charAt(path.length - 1) ? path.slice(0, -1) : path
