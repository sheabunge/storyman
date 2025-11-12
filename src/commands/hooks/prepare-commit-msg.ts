import figures from '@inquirer/figures'
import { confirm, input } from '@inquirer/prompts'
import { Args } from '@oclif/core'
import { open, readFile, writeFile } from 'fs/promises'
import type { FileHandle } from 'node:fs/promises'
import { ReadStream } from 'node:tty'
import { EOL } from 'os'
import { yellow } from 'yoctocolors-cjs'
import { BaseCommand } from '../../BaseCommand'
import { Story } from '../../types/Story'
import { makeStoryInfoRequest } from '../../utils/jira'
import { formatStory, parseStory, STORY_RE } from '../../utils/story'
import { constants } from 'fs'

const PREFIX = '[storyman]'
const VALID_SOURCES = new Set(['commit', 'message'])
const AUTHOR_RE = /\[(?<author>.+)]\s*^/m

export default class PrepareCommitMsg extends BaseCommand<typeof PrepareCommitMsg> {
  public static hidden = true

  static strict = false

  static hiddenAliases = ['prepare-commit-msg', 'prepare-commit-message']

  static args = {
    commitMessageFile: Args.file({ required: true }),
    commitSource: Args.string(),
    commitSHA1: Args.string()
  }

  private inputHandle: FileHandle | undefined

  private readStream: ReadStream | undefined

  private getReadStream = async (): Promise<ReadStream | undefined> => {
    if (process.stdin.isTTY) {
      return undefined
    }

    if (!this.inputHandle) {
      const { O_RDONLY, O_NOCTTY } = constants

      try {
        this.inputHandle = await open('/dev/tty', O_RDONLY + O_NOCTTY)
      } catch {
        return undefined
      }
    }

    this.readStream = new ReadStream(this.inputHandle.fd)
    return this.readStream
  }

  private closeReadStream = async (): Promise<void> => {
    if (this.readStream) {
      this.readStream.destroy()
      this.readStream = undefined
    }

    if (this.inputHandle) {
      await this.inputHandle.close()
      this.inputHandle = undefined
    }
  }

  private async getStoryTag(story: Story | undefined, commitMessage: string): Promise<string | undefined> {
    const existingTag = commitMessage.match(STORY_RE)

    if (existingTag) {
      this.log(`${PREFIX} Commit message already mentions story ${existingTag[0]}.`)
      return undefined
    }

    if (story) {
      return formatStory(story)
    }

    return input(
      {
        message: `${PREFIX} Commiting to a non-story branch. Enter a story to tag this commit, or leave blank to commit untagged:`,
        theme: { prefix: { idle: yellow(figures.warning) } }
      },
      { input: await this.getReadStream() }
    )
      .then(response => response.trim())
      .catch((): undefined => undefined)
      .finally(() => this.closeReadStream())
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

    if (storyTag) {
      const story = parseStory(storyTag)
      const storyInfo = await makeStoryInfoRequest(await this.userConfig, story, ['resolution'])

      if (!storyInfo) {
        this.warn('Could not contact Jira to verify story status.')
      } else if (storyInfo.fields?.resolution) {
        const answer = await confirm(
          {
            message: `${formatStory(story)} is marked as resolved (${storyInfo.fields.resolution.name}). Continue with this commit?`,
            theme: { prefix: { idle: yellow(figures.warning) } }
          },
          { input: await this.getReadStream() }
        ).finally(() => this.closeReadStream())

        if (!answer) {
          await writeFile(commitMessageFile, '')
          return
        }
      }
    }

    await writeFile(
      commitMessageFile,
      [[storyTag, messageHead, authorTag].filter(Boolean).join(' '), ...messageBody].join(EOL)
    )
  }
}
