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
* [`story`](#story)
* [`story config`](#story-config)
* [`story config clear PROP`](#story-config-clear-prop)
* [`story config d PROP`](#story-config-d-prop)
* [`story config del PROP`](#story-config-del-prop)
* [`story config delete PROP`](#story-config-delete-prop)
* [`story config l`](#story-config-l)
* [`story config list`](#story-config-list)
* [`story config remove PROP`](#story-config-remove-prop)
* [`story config rm PROP`](#story-config-rm-prop)
* [`story config s PROP VALUE`](#story-config-s-prop-value)
* [`story config set PROP VALUE`](#story-config-set-prop-value)
* [`story config unset PROP`](#story-config-unset-prop)
* [`story get`](#story-get)
* [`story help [COMMAND]`](#story-help-command)
* [`story info`](#story-info)
* [`story install [REPO]`](#story-install-repo)
* [`story jira [STORY]`](#story-jira-story)
* [`story open [STORY]`](#story-open-story)
* [`story prepare-commit-message COMMITMESSAGEFILE [COMMITSOURCE] [COMMITSHA1]`](#story-prepare-commit-message-commitmessagefile-commitsource-commitsha1)
* [`story prepare-commit-msg COMMITMESSAGEFILE [COMMITSOURCE] [COMMITSHA1]`](#story-prepare-commit-msg-commitmessagefile-commitsource-commitsha1)
* [`story uninstall [REPO]`](#story-uninstall-repo)

## `story`

Retrieve the story identifier from the current Git branch.

```
USAGE
  $ story

DESCRIPTION
  Retrieve the story identifier from the current Git branch.

ALIASES
  $ story 

EXAMPLES
  $ story
  SM-12
```

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

EXAMPLES
  $ story config
  defaultAuthor = "Shea"
  jiraUrl = "https://something.atlassian.net/"
```

_See code: [src/commands/config/index.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/config/index.ts)_

## `story config clear PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config clear PROP

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

## `story config d PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config d PROP

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

## `story config del PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config del PROP

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

## `story config delete PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config delete PROP

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

## `story config l`

Display the list of current configuration properties.

```
USAGE
  $ story config l

DESCRIPTION
  Display the list of current configuration properties.

ALIASES
  $ story config list
  $ story config l

EXAMPLES
  $ story config
  defaultAuthor = "Shea"
  jiraUrl = "https://something.atlassian.net/"
```

## `story config list`

Display the list of current configuration properties.

```
USAGE
  $ story config list

DESCRIPTION
  Display the list of current configuration properties.

ALIASES
  $ story config list
  $ story config l

EXAMPLES
  $ story config
  defaultAuthor = "Shea"
  jiraUrl = "https://something.atlassian.net/"
```

## `story config remove PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config remove PROP

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

## `story config rm PROP`

Reset a configuration property to its default value.

```
USAGE
  $ story config rm PROP

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

## `story config s PROP VALUE`

Set a new value for a configuration property.

```
USAGE
  $ story config s PROP... VALUE...

DESCRIPTION
  Set a new value for a configuration property.

ALIASES
  $ story config s

EXAMPLES
  $ story config set defaultAuthor Shea B
  defaultAuthor = Shea B
```

## `story config set PROP VALUE`

Set a new value for a configuration property.

```
USAGE
  $ story config set PROP... VALUE...

DESCRIPTION
  Set a new value for a configuration property.

ALIASES
  $ story config s

EXAMPLES
  $ story config set defaultAuthor Shea B
  defaultAuthor = Shea B
```

_See code: [src/commands/config/set.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/config/set.ts)_

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

_See code: [src/commands/config/unset.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/config/unset.ts)_

## `story get`

Retrieve the story identifier from the current Git branch.

```
USAGE
  $ story get

DESCRIPTION
  Retrieve the story identifier from the current Git branch.

ALIASES
  $ story 

EXAMPLES
  $ story
  SM-12
```

_See code: [src/commands/get.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/get.ts)_

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

## `story info`

View information about the current story environment.

```
USAGE
  $ story info

DESCRIPTION
  View information about the current story environment.

EXAMPLES
  $ story info
  Current story is SM-123.
   
  Reading configuration from /home/shea/.storyman.json.
```

_See code: [src/commands/info.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/info.ts)_

## `story install [REPO]`

Install the git prepare-commit-msg hook.

```
USAGE
  $ story install [REPO] [-f]

ARGUMENTS
  [REPO]  [default: .] Path to Git repository. Defaults to current directory.

FLAGS
  -f, --force  override an existing prepare-commit-msg hook

DESCRIPTION
  Install the git prepare-commit-msg hook.

  Install the git `prepare-commit-msg` hook.

EXAMPLES
  $ story install
  Created prepare-commit-msg hook for /home/shea/projects/some-project.

  $ story install ~/projects/another-project
  Created prepare-commit-msg hook for /home/shea/projects/another-project.
```

_See code: [src/commands/install.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/install.ts)_

## `story jira [STORY]`

Open the active story in Jira.

```
USAGE
  $ story jira [STORY]

ARGUMENTS
  [STORY]  Open this story, instead of the current story.

DESCRIPTION
  Open the active story in Jira.

ALIASES
  $ story jira

EXAMPLES
  $ story open
  Opening https://something.atlassian.net/browse/SM-12

  $ story open 42
  Opening https://something.atlassian.net/browse/SM-42

  $ story open TS-19
  Opening https://something.atlassian.net/browse/TS-19
```

## `story open [STORY]`

Open the active story in Jira.

```
USAGE
  $ story open [STORY]

ARGUMENTS
  [STORY]  Open this story, instead of the current story.

DESCRIPTION
  Open the active story in Jira.

ALIASES
  $ story jira

EXAMPLES
  $ story open
  Opening https://something.atlassian.net/browse/SM-12

  $ story open 42
  Opening https://something.atlassian.net/browse/SM-42

  $ story open TS-19
  Opening https://something.atlassian.net/browse/TS-19
```

_See code: [src/commands/open.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/open.ts)_

## `story prepare-commit-message COMMITMESSAGEFILE [COMMITSOURCE] [COMMITSHA1]`

```
USAGE
  $ story prepare-commit-message COMMITMESSAGEFILE... [COMMITSOURCE...] [COMMITSHA1...]

ALIASES
  $ story prepare-commit-msg
  $ story prepare-commit-message
```

## `story prepare-commit-msg COMMITMESSAGEFILE [COMMITSOURCE] [COMMITSHA1]`

```
USAGE
  $ story prepare-commit-msg COMMITMESSAGEFILE... [COMMITSOURCE...] [COMMITSHA1...]

ALIASES
  $ story prepare-commit-msg
  $ story prepare-commit-message
```

## `story uninstall [REPO]`

Uninstall the git prepare-commit-msg hook.

```
USAGE
  $ story uninstall [REPO]

ARGUMENTS
  [REPO]  [default: .] Path to Git repository. Defaults to current directory.

DESCRIPTION
  Uninstall the git prepare-commit-msg hook.

  Uninstall the git `prepare-commit-msg` hook.

EXAMPLES
  $ story uninstall
  Removed prepare-commit-msg hook from /home/shea/projects/some-project.

  $ story uninstall ~/projects/another-project
  Removed prepare-commit-msg hook from /home/shea/projects/another-project.
```

_See code: [src/commands/uninstall.ts](https://github.com/sheabunge/storyman/blob/v2.0.0-dev.1/src/commands/uninstall.ts)_
<!-- commandsstop -->
