import { Command, Interfaces } from '@oclif/core'
import { homedir } from 'os'
import { join } from 'path'
import UserConfig from './UserConfig'
import type { Story } from './types/Story'
import { UserConfigProps } from './types/UserConfigProps'
import { findClosestFileDir } from './utils'
import { getCurrentBranch } from './utils/git'

export const USER_CONFIG_FILENAME = '.storyman.json'
export const STORY_RE = /^(?<project>[A-Z]+)-(?<number>\d+)/

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected args!: Args<T>

  protected flags!: Flags<T>

  protected static userConfigDefaults: UserConfigProps = {
    defaultAuthor: '',
    jiraUrl: ''
  }

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
        const userConfig = new UserConfig(
          join(storyDir, USER_CONFIG_FILENAME),
          BaseCommand.userConfigDefaults
        )

        this._userConfig = userConfig
        return userConfig
      })
  }

  async getStory(): Promise<Story> {
    const branch = await getCurrentBranch()

    const match = STORY_RE.exec(branch)

    if (!match?.groups?.project || !match.groups?.number) {
      this.error(`Could not find story in branch '${branch}'.`)
    }

    const { project, number } = match.groups
    return { project, number: Number(number) }
  }
}
