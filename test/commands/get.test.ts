import { expect, test } from '@oclif/test'
import { cleanupStoryFiles, createStoryFile } from '../utils'

const STORY = 'TEST-11'
const CHILD_STORY = 'TEST-23'

describe('get story', () => {
  test
    .do(async () => createStoryFile(STORY))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['get'])
    .it('gets current story', async context => {
      expect(context.stdout).to.eq(`${STORY}\n`)
    })

  test
    .do(async () => createStoryFile(`${STORY} ${CHILD_STORY}`))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['get'])
    .it('gets current story, excluding child story', async context => {
      expect(context.stdout).to.eq(`${STORY}\n`)
    })

  test
    .do(async () => createStoryFile(`${STORY} ${CHILD_STORY}`))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['get', '--full'])
    .it('gets current story, including child story', async context => {
      expect(context.stdout).to.eq(`${STORY} ${CHILD_STORY}\n`)
    })

  test
    .do(async () => createStoryFile(`\n\n${STORY} \n  ${CHILD_STORY}\n`))
    .finally(cleanupStoryFiles)
    .stdout()
    .command(['get', '--full'])
    .it('gets current story from file with additional whitespace', async context => {
      expect(context.stdout).to.eq(`${STORY} ${CHILD_STORY}\n`)
    })
})
