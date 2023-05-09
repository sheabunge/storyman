import { expect, test } from '@oclif/test'
import { cleanupStoryFiles, createStoryFile, readStoryFile } from '../utils'

const STORY = 'TEST-22'
const CHILD_STORY = 'TEST-32'

describe('clear story', () => {
  test
    .do(async () => createStoryFile(STORY))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['clear'])
    .it('clears current story', async context => {
      expect(context.stdout).to.eq(`Current story has been cleared, was ${STORY}.\n`)
      expect(await readStoryFile()).to.eq('')
    })

  test
    .do(async () => createStoryFile(`${STORY} ${CHILD_STORY}`))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['clear'])
    .it('clears both parent and child stories', async context => {
      expect(context.stdout).to.eq(`Current story has been cleared, was ${STORY} ${CHILD_STORY}.\n`)
      expect(await readStoryFile()).to.eq('')
    })
})
