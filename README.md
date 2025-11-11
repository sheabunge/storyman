storyman
========

When using project-tracking tools such as Jira, it can be useful to include a story tag (such as EG-123) in commit
messages, so that changes can be linked to stories and vice versa.

Instead of doing so manually, which can be prone to inconsistency and mistakes, this tool automates the process by
rewriting commit messages to include the current story.

# Installation

Install through npm:

```sh-session
$ npm install -g storyman
```

In order to rewrite commit messages automatically, storyman will need to be installed in any Git repositories where
you want tagged commits.

This can be achieved by running  `story install` inside an existing Git repository:

```sh-session
$ cd ~/projects/some-project
$ story install
Created prepare-commit-msg hook for /home/shea/projects/some-project.
```

Or by passing a repository to `story install` as the first argument:

```sh-session
$ story install ~/projects/another-project
Created prepare-commit-msg hook for /home/shea/projects/another-project.
```

# Usage

storyman v2 has switched to a branch-based method of tracking stories. When working on a new story, create a Git branch
beginning with the story tag:

```sh-session
$ git checkout -b SM-124
```

Branch names can include an optional 'comment' following this story tag, which will be ignored by storyman:

```sh-session
$ git branch -m SM-124-introduce-x-feature
```

You check what the detected story is using `story`:

```sh-session
$ story
EG-123
```

When making a commit, storyman will automatically add the current story tag to the beginning of the commit message:

```sh-session
$ git commit -m "Made some changes."
[master fb98b25] EG-123 Made some changes.
 1 file changed, 71 insertions(+), 3 deletions(-)
```

## Tagging authors

Storyman also supports workflows that involve also including the name of the commit authors in each message,
like this:

    EG-12 Made some changes. [Shea]

To enable this functionality, set the `defaultAuthor` configuration property:

```sh-session
$ story config set defaultAuthor Shea
```

If you specify an author in the commit message manually, storyman will attempt to detect this and refrain from adding
an author tag.

## Opening Jira

Storyman makes it easy to navigate from code to the Jira ticket you're currently working on.

Running the `story open` command will open the Jira ticket for the current story in the default web browser.

The first time you run this, it will prompt to enter a Jira site URL. This can be a URL to Jira cloud or to a
self-hosted instance:

```sh-session
$ story open
What is your Jira site URL?: https://something.atlassian.net/
Opening https://something.atlassian.net/browse/EG-12
```

# Command Reference

<!-- commands -->
* [`story help [COMMAND]`](#story-help-command)
* [`story plugins`](#story-plugins)
* [`story plugins add PLUGIN`](#story-plugins-add-plugin)
* [`story plugins:inspect PLUGIN...`](#story-pluginsinspect-plugin)
* [`story plugins install PLUGIN`](#story-plugins-install-plugin)
* [`story plugins link PATH`](#story-plugins-link-path)
* [`story plugins remove [PLUGIN]`](#story-plugins-remove-plugin)
* [`story plugins reset`](#story-plugins-reset)
* [`story plugins uninstall [PLUGIN]`](#story-plugins-uninstall-plugin)
* [`story plugins unlink [PLUGIN]`](#story-plugins-unlink-plugin)
* [`story plugins update`](#story-plugins-update)

## `story help [COMMAND]`

Display help for story.

```
USAGE
  $ story help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for story.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.35/src/commands/help.ts)_

## `story plugins`

List installed plugins.

```
USAGE
  $ story plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ story plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/index.ts)_

## `story plugins add PLUGIN`

Installs a plugin into story.

```
USAGE
  $ story plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into story.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the STORY_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the STORY_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ story plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ story plugins add myplugin

  Install a plugin from a github url.

    $ story plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ story plugins add someuser/someplugin
```

## `story plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ story plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ story plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/inspect.ts)_

## `story plugins install PLUGIN`

Installs a plugin into story.

```
USAGE
  $ story plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into story.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the STORY_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the STORY_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ story plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ story plugins install myplugin

  Install a plugin from a github url.

    $ story plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ story plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/install.ts)_

## `story plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ story plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ story plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/link.ts)_

## `story plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove

EXAMPLES
  $ story plugins remove myplugin
```

## `story plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ story plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/reset.ts)_

## `story plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove

EXAMPLES
  $ story plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/uninstall.ts)_

## `story plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ story plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ story plugins unlink
  $ story plugins remove

EXAMPLES
  $ story plugins unlink myplugin
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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/update.ts)_
<!-- commandsstop -->
