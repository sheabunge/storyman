oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g storyman
$ story COMMAND
running command...
$ story (--version)
storyman/0.0.0 darwin-arm64 node-v18.12.1
$ story --help [COMMAND]
USAGE
  $ story COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`story hello PERSON`](#story-hello-person)
* [`story hello world`](#story-hello-world)
* [`story help [COMMANDS]`](#story-help-commands)
* [`story plugins`](#story-plugins)
* [`story plugins:install PLUGIN...`](#story-pluginsinstall-plugin)
* [`story plugins:inspect PLUGIN...`](#story-pluginsinspect-plugin)
* [`story plugins:install PLUGIN...`](#story-pluginsinstall-plugin-1)
* [`story plugins:link PLUGIN`](#story-pluginslink-plugin)
* [`story plugins:uninstall PLUGIN...`](#story-pluginsuninstall-plugin)
* [`story plugins:uninstall PLUGIN...`](#story-pluginsuninstall-plugin-1)
* [`story plugins:uninstall PLUGIN...`](#story-pluginsuninstall-plugin-2)
* [`story plugins update`](#story-plugins-update)

## `story hello PERSON`

Say hello

```
USAGE
  $ story hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/sheabunge/storyman/blob/v0.0.0/dist/commands/hello/index.ts)_

## `story hello world`

Say hello world

```
USAGE
  $ story hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ story hello world
  hello world! (./src/commands/hello/world.ts)
```

## `story help [COMMANDS]`

Display help for story.

```
USAGE
  $ story help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for story.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `story plugins`

List installed plugins.

```
USAGE
  $ story plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ story plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `story plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ story plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ story plugins add

EXAMPLES
  $ story plugins:install myplugin 

  $ story plugins:install https://github.com/someuser/someplugin

  $ story plugins:install someuser/someplugin
```

## `story plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ story plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ story plugins:inspect myplugin
```

## `story plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ story plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ story plugins add

EXAMPLES
  $ story plugins:install myplugin 

  $ story plugins:install https://github.com/someuser/someplugin

  $ story plugins:install someuser/someplugin
```

## `story plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ story plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ story plugins:link myplugin
```

## `story plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove
```

## `story plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove
```

## `story plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove
```

## `story plugins update`

Update installed plugins.

```
USAGE
  $ story plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
