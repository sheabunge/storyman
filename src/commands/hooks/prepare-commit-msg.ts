import { readFile, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { BaseCommand, STORY_RE } from '../../BaseCommand'
import { Args } from '@oclif/core'
import { Story } from '../../types/Story'
import { formatStory } from '../../utils'

const PREFIX = '[storyman]'
const VALID_SOURCES = new Set(['commit', 'message'])
const AUTHOR_RE = /\[(?<author>.+)]\s*^/m

export default class PrepareCommitMsg extends BaseCommand<typeof PrepareCommitMsg> {
  static hidden = true

  static strict = false

  static aliases = ['prepare-commit-msg', 'prepare-commit-message']

  static args = {
    commitMessageFile: Args.file({ required: true }),
    commitSource: Args.string(),
    commitSHA1: Args.string()
  }

  private async getStoryTag(story: Story | undefined, commitMessage: string): Promise<string | undefined> {
    const existingTag = commitMessage.match(STORY_RE)

    if (existingTag) {
      this.log(`${PREFIX} Commit message already mentions story ${existingTag[0]}.`)
      return undefined
    }

    if (story) {
      return `${formatStory(story)} `
    }

    this.warn(`${PREFIX} Commit does not contain story tag.`)
    return undefined
  }

  private async getAuthorTag(commitMessage: string): Promise<string | undefined> {
    const defaultAuthor = await (await this.userConfig).get('defaultAuthor')
    const commitAuthor = commitMessage.match(AUTHOR_RE)?.groups?.author

    if (commitAuthor) {
      this.log(`${PREFIX} Commit is already tagged with ${commitAuthor} as author.`)
    } else if (defaultAuthor) {
      return ` [${defaultAuthor}]`
    }

    return undefined
  }

  async run() {
    const { args: { commitMessageFile, commitSource } } = await this.parse(PrepareCommitMsg)

    if (commitSource && !VALID_SOURCES.has(commitSource)) {
      this.log(`${PREFIX} This is a ${commitSource} commit, will leave untagged.`)
      this.exit(0)
    }

    const story = await this.getStory()
    const commitMessage = (await readFile(commitMessageFile)).toString()

    const [messageHead, ...messageBody] = commitMessage.split(EOL)

    const storyTag = await this.getStoryTag(story, messageHead)
    const authorTag = await this.getAuthorTag(commitMessage)

    if (!storyTag && !authorTag) {
      this.exit(0)
    }

    await writeFile(
      commitMessageFile,
      [[storyTag, messageHead, authorTag].join(''), ...messageBody].join(EOL)
    )
  }
}
