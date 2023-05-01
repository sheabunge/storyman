import { expect, test } from '@oclif/test'
import { mkdtemp, readFile, writeFile } from 'fs/promises'
import { chdir } from 'process'
import { tmpdir } from 'os'
import { join } from 'path'

const OLD_STORY = 'TEST-1'
const NEW_STORY = 'TEST-2'

describe('set', () => {
  test
    .do(async () => {
      chdir(await mkdtemp(join(tmpdir(), 'set.test')))
      await writeFile('.story', OLD_STORY)
    })
    .stdout()
    .command(['set', NEW_STORY])
    .it('runs story set', async context => {
      expect(context.stdout).to.eq(`Current story is now ${NEW_STORY}.\n`)
      expect((await readFile('.story')).toString()).to.eq(NEW_STORY)
    })
})
