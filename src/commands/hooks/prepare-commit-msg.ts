import { readFile, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { BaseCommand } from '../../base'
import { Args } from '@oclif/core'
import { Story } from '../../types/story'
import { formatStory, splitStory } from '../../utils'

const PREFIX = '[storyman]'
const VALID_SOURCES = new Set(['message', 'commit'])
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

  private async buildStoryRegExp(story: Story) {
    const userConfig = await this.userConfig
    const projects = new Set((await userConfig.get('projects')).split(/\W+/))

    const defaultProject = await userConfig.get('defaultProject')
    projects.add(defaultProject)

    const [parentProject] = splitStory(story.parent)
    projects.add(parentProject)

    if (story.child) {
      const [childProject] = splitStory(story.child)
      projects.add(childProject)
    }

    return new RegExp(`/(?:${[...projects.values()].join('|')})-\\d+/`)
  }

  private async getStoryTag(story: Story, commitMessage: string): Promise<string | undefined> {
    const existingTag = commitMessage.match(await this.buildStoryRegExp(story))

    if (existingTag?.groups) {
      this.log(`${PREFIX} Commit message already mentions story ${existingTag.groups[0]}.`)
    } else {
      return `${formatStory(story)} `
    }
  }

  private async getAuthorTag(commitMessage: string): Promise<string | undefined> {
    const defaultAuthor = await (await this.userConfig).get('defaultAuthor')
    const commitAuthor = commitMessage.match(AUTHOR_RE)?.groups?.author

    if (commitAuthor) {
      this.log(`${PREFIX} Commit is already tagged with ${commitAuthor} as author.`)
    } else if (defaultAuthor) {
      return ` [${defaultAuthor}]`
    }
  }

  async run() {
    const { args: { commitMessageFile, commitSource } } = await this.parse(PrepareCommitMsg)

    if (commitSource && !VALID_SOURCES.has(commitSource)) {
      this.log(`${PREFIX} This is a ${commitSource} commit, will leave untagged.`)
      this.exit(0)
    }

    const story = await this.getStory()
    const commitMessage = (await readFile(commitMessageFile)).toString()

    const storyTag = await this.getStoryTag(story, commitMessage)
    const authorTag = await this.getAuthorTag(commitMessage)

    if (!storyTag && !authorTag) {
      this.exit(0)
    }

    const [messageHead, ...messageBody] = commitMessage.split(EOL)

    await writeFile(
      commitMessageFile,
      [[storyTag, messageHead, authorTag].join(''), ...messageBody].join(EOL)
    )
  }
}
