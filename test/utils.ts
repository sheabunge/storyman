import { mkdtemp, readFile, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { chdir } from 'process'

export const createStoryFile = async (story: string) => {
  chdir(await mkdtemp(join(tmpdir(), 'set.test')))
  await writeFile('.story', story)
}

export const readStoryFile = async () =>
  (await readFile('.story')).toString()
