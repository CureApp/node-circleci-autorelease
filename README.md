# node-circleci-autorelease

Autorelease your node packages.

-   [tag](#3-commit-and-push-it)
-   [branch](#config-field)
-   [gh-pages](#config-about-gh-pages)
-   [npm publish](#npm-publish)

It looks up the latest commit log and extracts release name.

```sh
git commit -m 'release 1.2.3'
git push origin master
```

CircleCI creates tag `1.2.3`.

You can add and remove files for release tag via hooks.

# installation

```sh
npm install --save-dev node-circleci-autorelease
```
on your Node.js project.


## install cli for global (optional)
Use [nca-cli](https://github.com/CureApp/nca-cli) for omitting `$(npm bin)/`.

```sh
npm install -g nca-cli
```

This tiny module calls local `nca` command without absolute path (e.g. `$(npm bin)/`).

As `nca-cli` itself doesn't contain `node-circleci-autorelease`, you don't have to consider version inconsistencies.

**Notice: the following sample commands call global `nca`.**

**If you skip installing `nca-cli`, attach `$(npm bin)/` before `nca` command.**


# usage

## 1. initializing

```bash
nca init
```

Two setting files will be generated.

1.  `.autorelease.yml`: config file.
2.  `.releaseignore`: files/patterns to be ignored in release. the same format as .gitignore.

You can set current node version with `--node` option.


```bash
nca init --node
```


## 2. generate circle.yml

```bash
nca generate
```

It creates `circle.yml` to your current working directory for auto-release.

## 3. commit and push it

Push to master branch with a specific commit message.

```sh
git commit -m 'release X.Y.Z'
git push origin master
```

Then, CircleCI detects the commit message pattern and creates a tag `X.Y.Z`
(See [version-bumping](#version-bumping) for automated commit.)

# configuration

Edit `.autorelease.yml`. It's like the following format.

```yaml
hooks:
  gh_pages:
    pre:
      - npm run generate-doc
config:
  version_prefix: v
  create_gh_pages: true
  create_gh_pages: doc
circle:
  machine:
    environment:
      node:
        version: 6.2.0
```
You can see three fields.

-   config: config fields
-   hooks: hook commands
-   circle: totally compatible with circle.yml

## config field

| key              | description                         | default              |
| :--------------- | :---------------------------------- | :------------------- |
| git_user_name    | user name of the release commit     | CircleCI             |
| git_user_email   | user email of the release commit    | circleci@example.com |
| npm_update_depth | --depth option to "npm update"      | 0 ( = no run)        |
| version_prefix   | prefix of tags to be created        | v                    |
| create_branch    | create release branch or not        | false                |
| npm_shrinkwrap   | run "npm shrinkwrap" before release | false                |
| create_gh_pages  | create gh-pages branch or not       | false                |
| gh_pages_dir     | directory to publish on gh-pages    | (null)               |

### npm_update_depth

node-circleci-autorelease tries to update node_modules via `npm update` everytime after `npm install`.
`npm_update_depth` config is the depth of the update.
By default, 0 is set and `npm update` will never occur.

```yaml
config:
  npm_update_depth: 3
```

### version_prefix

To release `v1.2.3`, you should set

```yaml
config:
  version_prefix: v
```

at your .autorelease.yml and make a commit with message

    release 1.2.3

### npm_shrinkwrap

node-circleci-autorelease tries to fix all the node_modules versions before release
by the executed ones using `npm shrinkwrap`. To enable this function,

```yaml
config:
  shrinkwrap: true
```

### config about gh-pages

To release `gh-pages` branch, you should set

```yaml
config:
  create_gh_pages: true
  gh_pages_dir: doc
```

If `gh_pages_dir` is set, only the directory is hosted.

### example

```yaml
---
config:
  git_user_name: shinout
  git_user_email: shinout310@gmail.com
  npm_update_depth: 5
  version_prefix: v
  create_branch: true
  npm_shrinkwrap: true
  create_gh_pages: true
  gh_pages_dir: doc
```

## hooks field

You can register commands before/after the following timings.

-   update_modules: before/after running `npm update`
-   release: before/after releasing process
-   gh_pages: before/after creating gh-pages branch

Each section must have "pre" or "post" section containing a command or list of commands.

### example

1. Convert ES6+ files in src to dist using babel

```yaml
---
hooks:
  update_modules:
    post:
        - babel src -d dist
```


2. Add timestamp

```yaml
---
hooks:
  release:
    pre: date "+%s" > timestamp
```

3. Add documentation files before release using documentationjs

```yaml
---
hooks:
  gh_pages:
    pre: documentation build --format html -o doc src/**/*
```

## circle field

Write your custom circle.yml setting here.
**don't write circle.yml** but write here and make them via `nca generate` command.

### example

```yaml
---
circle:
  general:
    branches:
      ignore:
        - xxx
  machine:
    environment:
      ABC: 123
  dependencies:
    post:
      - npm run xxx
```

# .releaseignore file

Files/patterns to be ignored in release.
Format is the same as .gitignore.

## example

```text
# dot files
.*

# npm https://www.npmjs.com
node_modules

# documentations
/doc

# source files
/src

# test files
/test

# development tools
/tools

# CircleCI cetting https://circleci.com
circle.yml

# debug logs
*.log
```

# version bumping

`node-circleci-autorelease` can bump versions with version-bumping tools.
Two bumping tools are available.

-   bmp: [kt3k/bmp](https://github.com/kt3k/bmp).
-   bmp: [januswel/yangpao](https://github.com/januswel/yangpao).

```sh
gem install bmp
```

or

```sh
go get github.com/januswel/yangpao
```

## usage

```bash
nca bmp p
nca bmp m
nca bmp j
nca bmp r
```

They update version and commit with a message except running `nca bmp r`.
These commands also update circle.yml automatically.

### re-release

`nca bmp r` doesn't bump version. Instead, it makes an empty commit with the following message:

    re-release X.Y.Z

where X.Y.Z is the current version. This is useful when the last release is failed.

This feature is disabled by default.

# npm publish

Enable publishing your project by setting two environment variables at CircleCI.

```sh
NPM_AUTH  # "_auth" of your .npmrc
NPM_EMAIL # "email" of your .npmrc
```

then CircleCI automatically runs `npm publish`.

# DRY RUN

```sh
DRY_RUN=1 nca
```

# JavaScript API

Run command with args.

es6+

```js
import {run} from 'node-circleci-autorelease'
nca.run(['bmp', 'p', '-s'])
```

commonjs

```js
var nca = require('node-circleci-autorelease')
nca.run(['bmp', 'p', '-s'])
```

Note that 2nd argument should be

# LICENSE

MIT
