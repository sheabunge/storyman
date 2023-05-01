import { mkdtemp, readFile, writeFile, rm, rmdir, access } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { chdir, cwd } from 'process'
import { STORY_FILENAME, USER_CONFIG_FILENAME } from '../src/baseCommand'

export const createStoryFile = async (story: string) => {
  chdir(await mkdtemp(join(tmpdir(), 'set.test')))
  await writeFile(STORY_FILENAME, story)
}

export const readStoryFile = async () =>
  (await readFile(STORY_FILENAME)).toString()

const deleteIfExists = (file: string) =>
  access(file).then(() => rm(file)).catch(() => Function.prototype)

export const cleanupStoryFiles = async () => {
  await deleteIfExists(STORY_FILENAME)
  await deleteIfExists(USER_CONFIG_FILENAME)

  const dir = cwd()
  chdir('..')
  await rmdir(dir)
}
