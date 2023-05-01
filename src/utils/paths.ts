import { homedir } from 'os'
import { resolve } from 'path'
import { Story } from '../types/story'

export const expandPath = (filename: string): string =>
  resolve(filename.replace(/^~/, homedir()))

export const trimLeadingSlash = (path: string): string =>
  '/' === path.charAt(0) ? path.slice(1) : path

export const trimTrailingSlash = (path: string): string =>
  '/' === path.charAt(path.length - 1) ? path.slice(0, -1) : path