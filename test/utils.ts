import { mkdtemp, rm, rmdir } from 'fs/promises'
import { exec as legacyExec } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { chdir, cwd } from 'process'
import { promisify } from 'util'
import { USER_CONFIG_FILENAME } from '../src/BaseCommand'
import { deleteIfExists } from '../src/utils'

const exec = promisify(legacyExec)

const TEMP_DIR_PREFIX = 'storyman-test-'

export const createStoryBranch = async (story: string): Promise<string> => {
  const dirname = await mkdtemp(join(tmpdir(), TEMP_DIR_PREFIX))
  chdir(dirname)
  await exec(`git init -b ${story}`)
  return dirname
}

export const cleanup = async () => {
  if (cwd().startsWith(TEMP_DIR_PREFIX)) {
    await deleteIfExists(USER_CONFIG_FILENAME)
    await rm('.git/', { force: true, recursive: true })

    const dir = cwd()
    chdir('..')
    await rmdir(dir)
  }
}
