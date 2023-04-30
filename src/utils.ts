import { homedir } from 'os'
import { resolve } from 'path'

export const expandPath = (filename: string): string =>
  resolve(filename.replace(/^~/, homedir()))

export const trimLeadingSlash = (path: string): string =>
  '/' === path.charAt(0) ? path.substring(1) : path

export const trimTrailingSlash = (path: string): string =>
  '/' === path.charAt(path.length - 1) ? path.substring(0, path.length - 1) : path
