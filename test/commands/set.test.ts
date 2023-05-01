import { expect, test } from '@oclif/test'
import { createStoryFile, readStoryFile } from '../utils'

const OLD_STORY = 'TEST-1'
const NEW_STORY = 'TEST-2'

describe('set', () => {
  test
    .do(async () => await createStoryFile(OLD_STORY))
    .stdout()
    .command(['set', NEW_STORY])
    .it('runs story set', async context => {
      expect(context.stdout).to.eq(`Current story is now ${NEW_STORY}.\n`)
      expect(await readStoryFile()).to.eq(NEW_STORY)
    })
})
