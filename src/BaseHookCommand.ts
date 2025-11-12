import { Command } from '@oclif/core'
import { constants } from 'fs'
import { open } from 'fs/promises'
import type { FileHandle } from 'node:fs/promises'
import { ReadStream } from 'node:tty'
import { BaseCommand } from './BaseCommand'

export abstract class BaseHookCommand<T extends typeof Command> extends BaseCommand<T> {
  private inputHandle: FileHandle | undefined

  private readStream: ReadStream | undefined

  protected getReadStream = async (): Promise<ReadStream | undefined> => {
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

  protected closeReadStream = async (): Promise<void> => {
    if (this.readStream) {
      this.readStream.destroy()
      this.readStream = undefined
    }

    if (this.inputHandle) {
      await this.inputHandle.close()
      this.inputHandle = undefined
    }
  }
}
