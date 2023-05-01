import { Args, Command } from '@oclif/core'
import { access, readFile } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { BaseCommand } from './base-command'

const HOOK_FILE = '.git/hooks/prepare-commit-msg'

const STORY_HOOK_RE = /^story\b/m

export abstract class InstallCommand<T extends typeof Command> extends BaseCommand<T> {
  static baseArgs = {
    repo: Args.directory({
      description: 'Path to Git repository. Defaults to current directory.',
      required: false,
      default: './',
      exists: true
    })
  }

  protected async getHookFile(repo: string) {
    const file = join(resolve(repo), HOOK_FILE)

    await access(dirname(file)).catch(() =>
      this.error('Current directory does not appear to be a Git repository.')
    )

    return file
  }

  protected isForeignHookFile = async (file: string) =>
    readFile(file)
      .then(buffer => !STORY_HOOK_RE.test(buffer.toString()))
      .catch(() => false)
}
