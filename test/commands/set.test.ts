import { expect, test } from '@oclif/test'

const TEST_STORY = 'TEST-2'

describe('set', () => {
  test
    .stdout()
    .command(['set', TEST_STORY])
    .it('runs story set', context => {
      expect(context.stdout).to.contain(`Current story is now ${TEST_STORY}.\n`)
    })
})
