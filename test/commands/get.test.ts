import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { cleanup, createStoryBranch } from '../utils'

describe('get story', () => {
  afterEach(cleanup)

  it('parses story from current branch', async () => {
    await createStoryBranch('TEST-11')
    const { stdout } = await runCommand('get')
    expect(stdout).to.equal('TEST-11\n')
  })

  it('parses story from branch with comment suffix', async () => {
    await createStoryBranch('TEST-123-some-additional-comment-15')
    const { stdout } = await runCommand('get')
    expect(stdout).to.equal('TEST-123\n')
  })

  it('fails if current branch does not begin with a story tag', async () => {
    await createStoryBranch('branch-name-without-story-tag')

    const { stdout, error } = await runCommand('get')

    expect(stdout).to.be.empty
    expect(error).to.be.an('error')
    expect(error?.message).to.equal('Could not find story in branch \'branch-name-without-story-tag\'.')
  })
})
