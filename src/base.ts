import { Command, Interfaces } from '@oclif/core'
import { homedir } from 'os'
import { resolve, join } from 'path'
import { readFile, writeFile, access } from 'fs/promises'
import UserConfig from './config'
import { UserConfigProps } from './types/UserConfigProps'
import { Story } from './types/Story'

const STORY_FILENAME = '.story'
const USER_CONFIG_FILENAME = '.storyman.json'

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>

const findStoryDir = (dir = './'): Promise<string> =>
  access(resolve(dir, STORY_FILENAME))
    .then(() => resolve(dir))
    .catch(() =>
      access(resolve(dir, USER_CONFIG_FILENAME))
        .then(() => resolve(dir))
        .catch(() =>
          dir === resolve(dir, '..') ?
            Promise.reject() :
            findStoryDir(resolve(dir, '..'))
        )
    )

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected args!: Args<T>
  protected flags!: Flags<T>

  protected static userConfigDefaults: UserConfigProps = {
    jiraUrl: '',
    defaultAuthor: '',
    defaultProject: '',
    requireStory: true,
    requireAuthor: false
  }

  private _storyDir: string | undefined
  private _storyFile: string | undefined
  private _userConfig: UserConfig<UserConfigProps> | undefined

  private get storyDir(): Promise<string> {
    return this._storyDir ?
      Promise.resolve(this._storyDir) :
      findStoryDir(STORY_FILENAME)
        .catch(() => join(homedir(), STORY_FILENAME))
        .then(storyDir => {
          this._storyDir = storyDir
          return storyDir
        })
  }

  get userConfig(): Promise<UserConfig<UserConfigProps>> {
    return this._userConfig ?
      Promise.resolve(this._userConfig) :
      this.storyDir.then(storyDir => {
        const userConfig = new UserConfig(
          join(storyDir, USER_CONFIG_FILENAME),
          BaseCommand.userConfigDefaults
        )

        this._userConfig = userConfig
        return userConfig
      })
  }

  get storyFile(): Promise<string> {
    return this._storyFile ?
      Promise.resolve(this._storyFile) :
      this.storyDir.then(storyDir => {
        const storyFile = join(storyDir, STORY_FILENAME)
        this._storyFile = storyFile
        return storyFile
      })
  }

  getStory = (): Promise<Story> =>
    this.storyFile.then(storyFile =>
      readFile(storyFile, 'utf8')
        .then(contents => {
          const [parent, child] = contents.trim().split(/\s+/)
          return <Story> { parent, child }
        })
        .catch(() =>
          this.error('Could not find story file.')))

  setStory = async (story: string, subStory?: string) => {
    const storyFile = await this.storyFile
    const defaultProject = await (await this.userConfig).get('defaultProject')

    const contents = [story, subStory].filter(Boolean).map(suffix =>
      suffix && defaultProject && /^\d+$/.test(suffix) ? `${defaultProject}-${suffix}` : suffix
    ).join(' ')

    return writeFile(storyFile, contents)
      .then(() => this.getStory())
      .then(updatedStory =>
        this.log(`Current story is now ${Object.values(updatedStory).filter(Boolean).join(' ')}.`)
      )
  }
}
