import { expect, test } from '@oclif/test'
import { cleanupStoryFiles, createStoryFile, readStoryFile } from '../utils'

const OLD_STORY = 'TEST-1'
const NEW_STORY = 'TEST-2'
const NEW_CHILD_STORY = 'TEST-12'

const setup = async () => createStoryFile(OLD_STORY)

describe('set story', () => {
  test
    .do(setup)
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['set', NEW_STORY])
    .it('sets a new story', async context => {
      expect(context.stdout).to.eq(`Current story is now ${NEW_STORY}.\n`)
      expect(await readStoryFile()).to.eq(NEW_STORY)
    })

  test
    .do(setup)
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['set', NEW_STORY, NEW_CHILD_STORY])
    .it('sets a new story with child story', async context => {
      expect(context.stdout).to.eq(`Current story is now ${NEW_STORY} ${NEW_CHILD_STORY}.\n`)
      expect(await readStoryFile()).to.eq(`${NEW_STORY} ${NEW_CHILD_STORY}`)
    })
})
