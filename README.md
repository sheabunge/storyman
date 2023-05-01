storyman
========

When using project-tracking tools such as Jira, it can be useful to include a story tag (such as EX-123) in commit
messages, so that changes can be linked to stories and vice-versa.

However, doing so manually can quickly become tiresome, and it's incredibly easy to forget to include a story tag, or
to use the wrong story by mistake.

Instead of needing to always manually specify the story number when committing, this tool can handle that for you.

# Usage

## Installation

Install through npm:

```sh-session
$ npm install -g storyman
```

Optionally, create an empty `.story` file in your project directory, or in the parent directory of your projects if
you'd like to share the same story across multiple Git repositories. This file will be used to store the current story
number.

```sh-session
$ touch .story
```

If you skip this step, then a `.story` file will be automatically created in the home directory.

Finally, you'll also need to install storyman in any Git repositories where you want automatically-tagged commits. This
can be achieved by running `story install` inside an existing Git repository:

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

Now you're ready to use storyman!

## Basic usage

When working on a new story, or switching between stories, use the `story set` command:

```sh-session
$ story set EX-123
Current story is now EX-123.
```

You can always check what the current story is using `story`:

```sh-session
$ story
EX-123
```

When making a commit, storyman will automatically add the current story tag to the beginning of the commit message:

```sh-session
$ git commit -m "Made some changes."
[master fb98b25] EX-123 Made some changes.
 1 file changed, 71 insertions(+), 3 deletions(-)
```

You can also use the `story` command when creating branches:

```sh-session
git checkout -b $(story)-fixes
Switched to a new branch 'EX-123-fixes'
```

## Default project

If you find yourself typically working in a single project, then storyman can automatically set this for you when
changing stories, so all you need to provide is the story number:

```sh-session
$ story set 12
Current story is now EX-12.
```

To enable this functionality, set the `defaultProject` configuration property:

```sh-session
$ story set config defaultProject EX
```

With this enabled, it's still possible to switch to stories from different projects, as long as the full story tag
is specified:

```sh-session
$ story set config defaultProject EX
$ story set SM-142
Current story is now SM-142.
```

## Tagging authors

Storyman also supports workflows that involve also including the name of the commit authors in each message,
like this:

    EX-12 Made some changes. [Shea]

To enable this functionality, set the `defaultAuthor` configuration property:

```sh-session
$ story config set defaultAuthor Shea
```

With this property enabled, storyman will attempt to determine whether a commit message already includes an author
tag, and refrain from adding a second one if so. This allows for individual one-off commits with different authors
to the default.

## Story override

Similarly to how the default author can be overridden in individual commits, the same functionality occurs for
overriding the default story in a single commit.

In order to use this functionality, it's necessary to specify a list of all possible project tags beforehand:

```sh-session
$ story config set projects "LIST OF PROJECT TAGS"
```

This is to ensure that only valid project keys are recognised as stories, instead of other text that matches the ABC-123
format. Here's an example of how this works:

```sh-session
$ story config set projects "EX SM ABC SHEA"
$ story set SM-123
$ git commit -m "EX-12 Made some changes."
Commit message already mentions story EX-12.
[master bf406096] EX-12 Made some changes.
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## Opening Jira

Storyman makes it easy to navigate from code to the Jira ticket you're currently working on.

Running the `story open` command will open the Jira ticket for the current story in the default web browser.

The first time you run this, it will prompt to enter a Jira site URL. This can be a URL to Jira cloud or to a
self-hosted instance:

```sh-session
$ story open
What is your Jira site URL?: https://something.atlassian.net/
Opening https://something.atlassian.net/browse/EX-12
```

## Sub-stories

When working with sub-stories or child stories, storyman is able to recognise and process both of these story
numbers. Simply specify both when using `set story`:

```sh-session
$ story set EX-12 EX-20
Current story is now EX-12 EX-20.
```

For convenience when working with branches, the basic `story` command will only output the parent story

```sh-session
$ git checkout $(story)-fixes
Switched to branch 'EX-12-fixes'
```

Both stories will be included in commit messages, and can be retrieved by passing the `--full` flag to `story get`:

```sh-session
$ story get --full
EX-12 EX-20
```

## Repository-specific stories

Storyman will always look for a `.story` file in the current working directory, and then work up the directory tree
until a match is found, otherwise defaulting to the user's home directory.

This allows you to have a global`.story` file that is shared between multiple repositories, or individual `.story` files
that can even be committed to Git and shared amongst a team.

Additionally, alongside the `.story` file will usually be a `.storyman.json` file which contains the configuration
properties that can be altered with the `story config` commands.

# Command Reference

<!-- commands -->

* [`story`](#story)
* [`story config`](#story-config)
* [`story config set PROP VALUE`](#story-config-set-prop-value)
* [`story config unset PROP`](#story-config-unset-prop)
* [`story help [COMMANDS]`](#story-help-commands)
* [`story info`](#story-info)
* [`story install [REPO]`](#story-install-repo)
* [`story open`](#story-open)
* [`story set STORY [SUBSTORY]`](#story-set-story-substory)
* [`story uninstall [REPO]`](#story-uninstall-repo)

## `story`

Retrieve the current story identifier.

```
USAGE
  $ story [-f]

FLAGS
  -f, --full  include both parent and child stories

DESCRIPTION
  Retrieve the current story identifier.

ALIASES
  $ story get

EXAMPLES
  $ story
  SM-123
```

_See code: [dist/commands/get.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/index.ts)_

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

_See
code: [dist/commands/config/get.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/config/index.ts)_

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

_See code: [dist/commands/info.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/info.ts)_

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

_See code: [dist/commands/install.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/install.ts)_

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

_See code: [dist/commands/open.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/open.ts)_

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

_See code: [dist/commands/set.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/set.ts)_

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

_See code: [dist/commands/uninstall.ts](https://github.com/sheabunge/storyman/blob/v1.0.0/dist/commands/uninstall.ts)_
<!-- commandsstop -->
