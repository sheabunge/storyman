import figures from '@inquirer/figures'
import { confirm, input } from '@inquirer/prompts'
import { Args } from '@oclif/core'
import { readFile, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { yellow } from 'yoctocolors-cjs'
import { BaseHookCommand } from '../../BaseHookCommand'
import { Story } from '../../types/Story'
import { makeStoryInfoRequest } from '../../utils/jira'
import { formatStory, parseStory, STORY_RE } from '../../utils/story'

const PREFIX = '[storyman]'
const VALID_SOURCES = new Set(['commit', 'message'])
const AUTHOR_RE = /\[(?<author>.+)]\s*^/m

export default class PrepareCommitMsg extends BaseHookCommand<typeof PrepareCommitMsg> {
  static hidden = true

  static strict = false

  static hiddenAliases = ['prepare-commit-msg', 'prepare-commit-message']

  static args = {
    commitMessageFile: Args.file({ required: true }),
    commitSource: Args.string(),
    commitSHA1: Args.string()
  }

  private async getStoryTag(commitMessage: string): Promise<string | undefined> {
    const existingTag = commitMessage.match(STORY_RE)

    if (existingTag) {
      this.log(`${PREFIX} Commit message already mentions story ${existingTag[0]}.`)
      return undefined
    }

    const story = await this.getStoryIfAvailable()

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

  private async validateStory(story: Story): Promise<boolean> {
    const userConfig = await this.userConfig
    const jiraUrl = await userConfig.get('jiraUrl')
    const jiraToken = await userConfig.get('jiraToken')

    if (!jiraUrl || !jiraToken) {
      return true
    }

    const storyInfo = await makeStoryInfoRequest({
      story, jiraUrl, jiraToken, fields: ['resolution']
    })

    if (!storyInfo) {
      this.warn('Could not contact Jira to verify story status.')
      return true
    }

    return !storyInfo.fields?.resolution || confirm(
      {
        message: `${PREFIX} Warning: ${formatStory(story)} is resolved as '${storyInfo.fields.resolution.name}'. Continue with this commit?`,
        theme: { prefix: { idle: yellow(figures.warning) } }
      },
      { input: await this.getReadStream() }
    ).finally(() => this.closeReadStream())
  }

  async run() {
    const { args: { commitMessageFile, commitSource } } = await this.parse(PrepareCommitMsg)

    if (commitSource && !VALID_SOURCES.has(commitSource)) {
      this.log(`${PREFIX} This is a ${commitSource} commit, will leave untagged.`)
      this.exit(0)
    }

    const commitMessage = (await readFile(commitMessageFile)).toString()
    const [messageHead, ...messageBody] = commitMessage.split(EOL)

    const storyTag = await this.getStoryTag(messageHead)
    const authorTag = await this.getAuthorTag(commitMessage)

    if (!storyTag && !authorTag) {
      this.exit(0)
    }

    await (storyTag && !await this.validateStory(parseStory(storyTag))
      ? writeFile(commitMessageFile, '')
      : writeFile(
        commitMessageFile,
        [[storyTag, messageHead, authorTag].filter(Boolean).join(' '), ...messageBody].join(EOL)
      ))
  }
}
