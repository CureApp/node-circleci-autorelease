# node-circleci-autorelease

create release tags, release branches and gh-pages at CircleCI for Node.js project

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
## generate circle.yml

```sh
npm run circle
```

creates `circle.yml` to your current working directory for auto-release.


## create a release tag at CircleCI

push to master branch with a specific commit message.

```sh
git commit -m 'release X.Y.Z'
git push origin master
```

CircleCI detects the commit message pattern and

creates a tag `X.Y.Z`

### prefix
You can set version prefix like

- `vX.Y.Z`
- `release-X.Y.Z`

when you set `version-prefix` field in package.json

See "customize" section for detail.


## hooks

Three npm scripts are prepared for hooks.

1. post-dependencies
2. pre-release
3. post-release
4. post-release

### post-dependencies

```sh
npm run post-dependencies
```
It runs at the last of `dependencies` section in CircleCI.

Thus, it runs at all commits.
Suitable for files required for test.

### pre-release

```sh
npm run pre-release
```
It runs just before creating a release tag.

Thus, it runs only at commits for release.
Suitable for files required only for production (`*.min.js`).

### post-release

```sh
npm run post-release
```
It runs just after creating a release tag.

Suitable for releasing commands like

```sh
bower register
```


### gh-pages

```sh
npm run gh-pages
```
It runs just before creating "gh-pages" branch.

Document generation would be suitable.

```sh
grunt yuidoc
```


## .releaseignore file

Files and directories written in `.releaseignore` are newly written into `.gitignore` just before creating a release tag.


## with bmp

more powerful commands with [kt3k/bmp](https://github.com/kt3k/bmp).

```sh
gem install bmp
```

then you can use following commands.

```sh
npm run bmp-p
npm run bmp-m
npm run bmp-j
npm run bmp-r
```

they update version and commit with a message except running `npm run bmp-r`.

```
release X.Y.Z
```
if you push to github/master, then CircleCI create a release tag.

### re-release
`npm run bmp-r` doesn't bump version. Instead, it makes an empty commit with the following message:

```
re-release X.Y.Z
```
where X.Y.Z is the current version. This is useful when the last release is failed.


## gh-pages

Just push to master, then `gh-pages` branch is created.

This feature is disabled by default.

Turn `create-gh-pages` to true in your package.json to enable it.

```json
{
  "node-circleci-autorelease": {
    "config": {
      "create-gh-pages": true,
      "gh-pages-dir": "doc"
    }
  }
}
```

`npm run gh-pages` is executed before creating the branch.


# customize

## ignore files for release

add `.releaseignore` file.
Format is the same as `.gitignore`.


## overwrite circle.yml

simply overwriting circle.yml works unless you rewrite the following section.

```yaml
deployment:
    create_release_branch:
```

## package.json

`node-circleci-autorelease` section in your package.json will be parsed as the same structure as circle.yml
except for `config` fields.

For example,
```json
{
  "node-circleci-autorelease": {
    "machine": {
      "node": {
        "version": "4.0.0"
      }
    },
    "config": {
      "version-prefix": "v"
    }
  }
}
```

**Don't forget to call** `npm run circle` after adding information to package.json.


### "config" field

customize "config" field in "node-circleci-autorelease" to add git information.

| key             | description                      | default             |
|:----------------|:---------------------------------|:--------------------|
| git-user-name   | user name of the release commit  | CircleCI            |
| git-user-email  | user email of the release commit | circleci@cureapp.jp |
| version-prefix  | prefix of tags to be created     | v                   |
| create-branch   | create release branch or not     | false               |
| create-gh-pages | create gh-pages branch or not    | false               |
| gh-pages-dir    | directory to publish on gh-pages | doc                 |


## npm publish
if you set two environment variables at CircleCI project settings,

```sh
NPM_AUTH  # "_auth" of your .npmrc
NPM_EMAIL # "email" of your .npmrc
```

then CircleCI automatically runs `npm publish`.


# requirements

- must be a node.js project.

- **grant write access for github to CircleCI**

There are two ways to grant write access:
- SSH key
- OAuth token

## SSH key
add user key, or [manually add read-write deployment key](https://circleci.com/docs/adding-read-write-deployment-key) to the project at [CircleCI](https://circleci.com)


## OAuth token
See [github: creating an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).

After creating, set `GITHUB_TOKEN` environment variable at CircleCI project settings.


# tips
## with grunt

add `grunt-cli` to devDependencies

you can write `grunt` command without full path in npm.

## with gulp

add `gulp` to devDependencies (which must already be included though.)


## with bower

add `bower` to devDependencies


# LICENSE
MIT
