import { Hook } from '@oclif/core/lib/interfaces'
import Get from '../commands/get'
import notFoundHook from '@oclif/plugin-not-found'

const hook: Hook.CommandNotFound = async function(this, options) {
  return !options.argv || options.argv.every(arg => arg.startsWith('-')) ?
    Get.run(options.argv) :
    notFoundHook.call(this, options)
}

export default hook
