import { input } from '@inquirer/prompts'
import { Args } from '@oclif/core'
import { open, readFile, writeFile } from 'fs/promises'
import type { FileHandle } from 'node:fs/promises'
import * as tty from 'node:tty'
import { EOL } from 'os'
import { BaseCommand, STORY_RE } from '../../BaseCommand'
import { Story } from '../../types/Story'
import { formatStory } from '../../utils'
import { constants } from 'fs'

const PREFIX = '[storyman]'
const VALID_SOURCES = new Set(['commit', 'message'])
const AUTHOR_RE = /\[(?<author>.+)]\s*^/m

const attemptOpenInput = async (): Promise<FileHandle | undefined> => {
  const { O_RDONLY, O_NOCTTY } = constants

  try {
    return await open('/dev/tty', O_RDONLY + O_NOCTTY)
  } catch {
    return undefined
  }
}

const promptForStory = async (): Promise<string | undefined> =>
  input({
    message: `${PREFIX} Commiting to a non-story branch. Enter a story to tag this commit, or leave blank to commit untagged:`
  })
    .then(response => response.trim())
    .catch((): undefined => undefined)

export default class PrepareCommitMsg extends BaseCommand<typeof PrepareCommitMsg> {
  public static hidden = true

  static strict = false

  static hiddenAliases = ['prepare-commit-msg', 'prepare-commit-message']

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

    if (process.stdin.isTTY) {
      return promptForStory()
    }

    const inputHandle = await attemptOpenInput()

    if (inputHandle) {
      const stdin = new tty.ReadStream(inputHandle.fd)

      Object.defineProperty(process, 'stdin', {
        configurable: true,
        enumerable: true,
        get: () => stdin
      })

      const response = await promptForStory()
      process.stdin.destroy()
      return response
    }

    this.warn(`${PREFIX} Warning: committing to a non-story branch and unable to prompt.`)
    return undefined
  }

  private async getAuthorTag(commitMessage: string): Promise<string | undefined> {
    const defaultAuthor = await (await this.userConfig).get('defaultAuthor')
    const commitAuthor = commitMessage.match(AUTHOR_RE)?.groups?.author

    if (commitAuthor) {
      this.log(`${PREFIX} Commit is already tagged with ${commitAuthor} as author.`)
    } else if (defaultAuthor) {
      return `[${defaultAuthor}]`
    }

    return undefined
  }

  async run() {
    const { args: { commitMessageFile, commitSource } } = await this.parse(PrepareCommitMsg)

    if (commitSource && !VALID_SOURCES.has(commitSource)) {
      this.log(`${PREFIX} This is a ${commitSource} commit, will leave untagged.`)
      this.exit(0)
    }

    const story = await this.getStoryIfAvailable()
    const commitMessage = (await readFile(commitMessageFile)).toString()

    const [messageHead, ...messageBody] = commitMessage.split(EOL)

    const storyTag = await this.getStoryTag(story, messageHead)
    const authorTag = await this.getAuthorTag(commitMessage)

    if (!storyTag && !authorTag) {
      this.exit(0)
    }

    await writeFile(
      commitMessageFile,
      [[storyTag, messageHead, authorTag].join(' '), ...messageBody].join(EOL)
    )
  }
}
