# node-circleci-autorelease
Autorelease your node packages.

- tag
- branch
- gh-pages
- npm publish

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

# usage
## initializing
```bash
$(npm bin)/nca init
```

Two setting files will be generated.

1. `.autorelease.yml`: config file.
2. `.releaseignore`: files/patterns to be ignored in release. the same format as .gitignore.

## generate circle.yml

```bash
$(npm bin)/nca generate
```
It creates `circle.yml` to your current working directory for auto-release.


## create a release tag at CircleCI

Push to master branch with a specific commit message.

```sh
git commit -m 'release X.Y.Z'
git push origin master
```

Then, CircleCI detects the commit message pattern and creates a tag `X.Y.Z`

# .autorelease.yml
Contains three sections.

- config: config fields
- hooks: hook commands
- circle: totally compatible with circle.yml

## config field

| key             | description                      | default             |
|:----------------|:---------------------------------|:--------------------|
| git_user_name   | user name of the release commit  | CircleCI            |
| git_user_email  | user email of the release commit | circleci@cureapp.jp |
| version_prefix  | prefix of tags to be created     | v                   |
| create_branch   | create release branch or not     | false               |
| create_gh_pages | create gh-pages branch or not    | false               |
| gh_pages_dir    | directory to publish on gh-pages | (null)              |

### prefix
To release `v1.2.3`, you should set

```yaml
config:
  version_prefix: v
```
at your .autorelease.yml and make a commit with message

```
release 1.2.3
```

### gh-pages
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
  version_prefix: v
  create_branch: true
  create_gh_pages: true
  gh_pages_dir: doc
```

## hooks field
You can register commands before/after the following timings.

- update_modules: before/after running `npm update`
- release: before/after releasing process
- gh_pages: before/after creating gh-pages branch

Each section must have "pre" or "post" section containing a command or list of commands.

### example

```yaml
---
hooks:
  update_modules:
    post:
        - npm run bundle-js
        - npm run bundle-css

  release:
    pre: npm run minify

  gh_pages:
    pre: npm run generate-doc
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

# .releaseignore
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


## with version-bumping tools

Two bumping tools are available.

- bmp: [kt3k/bmp](https://github.com/kt3k/bmp).
- bmp: [januswel/yangpao](https://github.com/januswel/yangpao).

```sh
gem install bmp
```

or

```sh
go get github.com/januswel/yangpao
```

## usage

```sh
nca bmp p
nca bmp m
nca bmp j
nca bmp r
```

They update version and commit with a message except running `nca bmp r`.
These commands also update circle.yml automatically.

### re-release
`nca bmp r` doesn't bump version. Instead, it makes an empty commit with the following message:

```
re-release X.Y.Z
```
where X.Y.Z is the current version. This is useful when the last release is failed.

This feature is disabled by default.


## npm publish
Enable publishing your project by setting two environment variables at CircleCI.

```sh
NPM_AUTH  # "_auth" of your .npmrc
NPM_EMAIL # "email" of your .npmrc
```

then CircleCI automatically runs `npm publish`.

# LICENSE
MIT
