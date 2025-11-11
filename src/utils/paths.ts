import { access, rm } from 'fs/promises'
import { homedir } from 'os'
import { resolve } from 'path'

export const expandPath = (filename: string): string =>
  resolve(filename.replace(/^~/, homedir()))

export const trimLeadingSlash = (path: string): string =>
  '/' === path.charAt(0) ? path.slice(1) : path

export const trimTrailingSlash = (path: string): string =>
  '/' === path.at(-1) ? path.slice(0, -1) : path

export const deleteIfExists = (file: string) =>
  access(file).then(() => rm(file)).catch(() => Function.prototype)

export const findClosestFileDir = (filename: string, dir = './'): Promise<string> =>
  access(resolve(dir, filename))
    .then(() => resolve(dir))
    .catch(() =>
      access(resolve(dir, filename))
        .then(() => resolve(dir))
        .catch(() =>
          dir === resolve(dir, '..')
            ? Promise.reject()
            : findClosestFileDir(filename, resolve(dir, '..'))))
