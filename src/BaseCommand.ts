import { Command, Interfaces } from '@oclif/core'
import { homedir } from 'os'
import { join } from 'path'
import UserConfig from './UserConfig'
import type { Story } from './types/Story'
import { UserConfigProps } from './types/UserConfigProps'
import { USER_CONFIG_FILENAME, USER_CONFIG_SPEC } from './utils/config'
import { getCurrentBranch } from './utils/exec'
import { findClosestFileDir } from './utils/paths'
import { parseStory } from './utils/story'

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected args!: Args<T>

  protected flags!: Flags<T>

  private _configDir: string | undefined

  private _userConfig: UserConfig<UserConfigProps> | undefined

  private get configDir(): Promise<string> {
    return this._configDir
      ? Promise.resolve(this._configDir)
      : findClosestFileDir(USER_CONFIG_FILENAME)
        .catch(() => join(homedir(), USER_CONFIG_FILENAME))
        .then(storyDir => {
          this._configDir = storyDir
          return storyDir
        })
  }

  get userConfig(): Promise<UserConfig<UserConfigProps>> {
    return this._userConfig
      ? Promise.resolve(this._userConfig)
      : this.configDir.then(storyDir => {
        this._userConfig = new UserConfig(USER_CONFIG_SPEC, join(storyDir, USER_CONFIG_FILENAME))
        return this._userConfig
      })
  }

  async getStoryIfAvailable(): Promise<Story | undefined> {
    const branch = await getCurrentBranch()
    return parseStory(branch)
  }

  async getStoryOrError(): Promise<Story> {
    const branchName = await getCurrentBranch()
    const story = parseStory(branchName)

    if (!story) {
      this.error(`Could not find story in branch '${branchName}'.`)
    }

    return story
  }

  async getStoryWithFallback(fallbackStory: string | undefined): Promise<Story> {
    const localStory = await this.getStoryIfAvailable()
    const story = fallbackStory ? parseStory(fallbackStory, localStory?.project) : localStory

    if (!story) {
      this.error('No story found or provided.')
    }

    return story
  }
}
