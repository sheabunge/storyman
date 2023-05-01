Story-Man
=================

Utility for automatically adding a story number to commit messages.

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
storyman/0.1.0 darwin-arm64 node-v18.12.1
$ story --help [COMMAND]
USAGE
  $ story COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`story config`](#story-config)
* [`story config set PROP VALUE`](#story-config-set-prop-value)
* [`story config unset PROP`](#story-config-unset-prop)
* [`story get`](#story-get)
* [`story help [COMMANDS]`](#story-help-commands)
* [`story info`](#story-info)
* [`story install [REPO]`](#story-install-repo)
* [`story open`](#story-open)
* [`story plugins`](#story-plugins)
* [`story plugins:inspect PLUGIN...`](#story-pluginsinspect-plugin)
* [`story plugins:install PLUGIN...`](#story-pluginsinstall-plugin)
* [`story plugins:link PLUGIN`](#story-pluginslink-plugin)
* [`story plugins:uninstall PLUGIN...`](#story-pluginsuninstall-plugin)
* [`story plugins update`](#story-plugins-update)
* [`story set STORY [SUBSTORY]`](#story-set-story-substory)
* [`story uninstall [REPO]`](#story-uninstall-repo)

## `story config`

Display the list of current configuration properties.

```
USAGE
  $ story config

DESCRIPTION
  Display the list of current configuration properties.

ALIASES
  $ story config list
  $ story config l
```

_See code: [dist/commands/config/index.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/config/index.ts)_

## `story config set PROP VALUE`

Set a new value for a configuration property.

```
USAGE
  $ story config set PROP VALUE

DESCRIPTION
  Set a new value for a configuration property.

ALIASES
  $ story config s

EXAMPLES
  $ story config set defaultProject SM
```

## `story config unset PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config unset PROP

DESCRIPTION
  Reset a configuration property to its default value.

ALIASES
  $ story config clear
  $ story config remove
  $ story config delete
  $ story config del
  $ story config rm
  $ story config d

EXAMPLES
  $ story config unset defaultProject
```

## `story get`

Retrieve the current story identifier.

```
USAGE
  $ story get [-f]

FLAGS
  -f, --full  include both parent and child stories

DESCRIPTION
  Retrieve the current story identifier.

ALIASES
  $ story 

EXAMPLES
  $ story get
  SM-123
```

_See code: [dist/commands/get.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/get.ts)_

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

## `story info`

View information about the current story environment.

```
USAGE
  $ story info

DESCRIPTION
  View information about the current story environment.

EXAMPLES
  $ story info
  Current story is SM-123
  Current child story is SM-134
  Reading story from /home/shea/.story
  Reading configuration from /home/shea/.storyman.json
```

_See code: [dist/commands/info.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/info.ts)_

## `story install [REPO]`

Install the git `prepare-commit-msg` hook.

```
USAGE
  $ story install [REPO] [-f]

ARGUMENTS
  REPO  [default: ./] Path to Git repository. Defaults to current directory.

FLAGS
  -f, --force  override an existing prepare-commit-msg hook

DESCRIPTION
  Install the git `prepare-commit-msg` hook.

EXAMPLES
  $ story install
```

_See code: [dist/commands/install.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/install.ts)_

## `story open`

Open the active story in Jira.

```
USAGE
  $ story open

DESCRIPTION
  Open the active story in Jira.

ALIASES
  $ story jira

EXAMPLES
  $ story open
```

_See code: [dist/commands/open.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/open.ts)_

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

## `story set STORY [SUBSTORY]`

Set the active story.

```
USAGE
  $ story set STORY [SUBSTORY]

ARGUMENTS
  STORY
  SUBSTORY  sub story

DESCRIPTION
  Set the active story.

EXAMPLES
  $ story set SM-123
  Current story is now SM-123.
```

_See code: [dist/commands/set.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/set.ts)_

## `story uninstall [REPO]`

Uninstall the git `prepare-commit-msg` hook.

```
USAGE
  $ story uninstall [REPO]

ARGUMENTS
  REPO  [default: ./] Path to Git repository. Defaults to current directory.

DESCRIPTION
  Uninstall the git `prepare-commit-msg` hook.

EXAMPLES
  $ story uninstall
```

_See code: [dist/commands/uninstall.ts](https://github.com/sheabunge/storyman/blob/v0.1.0/dist/commands/uninstall.ts)_
<!-- commandsstop -->
