# node-circleci-autorelease

generate `circle.yml` for creating release branch and tags for Node.js project


# concept

## release branch

branch **with builds** and **without sources**.

- **builds**:  products of build tools (browserified and babeled js, minified css)
- **sources**: unnecessary sources for production (e.g. spec/)



## add builds

two npm scripts add builds

### post-dependencies

```sh
npm run post-dependencies
```
runs at the last of `dependencies` section in CircleCI.

Thus, it runs at all commits.
Suitable for files required for test.

### pre-release

```sh
npm run pre-release
```
runs just before creating release branch.

Thus, it runs only at commits for release.
Suitable for files required only for production (`*.min.js`).


## remove sources

add `.releaseignore` file.

files and directories written in `.releaseignore` are removed just before creating release branch.


# installation

```sh
npm install node-circleci-autorelease
```

# requirements

- must be node.js project.

- **grant write access for github to CircleCI**

There are two ways:
- SSH key
- OAuth token

## SSH key



## OAuth token

**not recommended for public project**.

package.json
```json
{
  "node-circleci-autorelease": {
    "config": {
      "github-token": "your token here"
      }
    }
  }
}
```


# usage
## generate circle.yml

```sh
npm run circle
```

creates `circle.yml` to your current working directory for auto-release.


## create release branch at CircleCI

push to master branch with a specific commit message.

```sh
git commit -m 'release vX.Y.Z'
git push origin master
```

CircleCI detects the commit message pattern and

1. creates `release` branch
2. creates a tag `vX.Y.Z`


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
```

they update version and commit with a message

```
release vX.Y.Z
```
if you push to github/master, then CircleCI create release branch and tag.


# customize

## post-dependencies hook

modify `scripts` field in `package.json` like
```json
{
  "scripts": {
    "post-dependencies": "grunt browserify"
  }
}
```

`npm run post-dependencies` runs at the last of `dependencies` section in CircleCI at all commits.

## pre-release hook

modify `scripts` field in `package.json` like
```json
{
  "scripts": {
    "pre-release": "grunt minify"
  }
}
```
`npm run pre-release` runs just before creating release branch in CircleCI.
You add for files required for test.

## ignore files for release

add `.releaseignore` file.

The following files and directories are ignored by default:

```text
node_modules
.gitignore
.editorconfig
spec
README.md
.releaseignore
.bmp.yml
npm-debug.log
```

These are written in `node-circleci-autorelease.ignores` field in your package.json

```json
{
  "node-circleci-autorelease": {
    "ignores": [
      "node_modules",
      ".gitignore",
      ".editorconfig",
      "spec",
      "README.md",
      ".releaseignore",
      ".bmp.yml",
      "npm-debug.log"
    ]
  }
}
```

## overwrite circle.yml

simply overwriting circle.yml works unless you rewrite the following section.

```yaml
deployment:
    create_release_branch:
```

## package.json

`node-circleci-autorelease` section in your package.json will be parsed as the same structure as circle.yml
except for `config` and `ignores` fields.

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
      "git-user-name": "CircleCI",
      "git-user-email": "circleci@cureapp.jp"
    },
    "ignores": [
      "node_modules",
      ".gitignore",
      ".editorconfig",
      "spec",
      "README.md",
      ".releaseignore",
      ".bmp.yml",
      "npm-debug.log"
    ]
  }
}
```

**Don't forget to call** `npm run circle` after adding information to package.json.


### `config` field

customize `config` field of `node-circleci-autorelease` to add git information.

| key            | description                      | default             |
|:---------------|:---------------------------------|:--------------------|
| git-user-name  | user name of the release commit  | CircleCI            |
| git-user-email | user email of the release commit | circleci@cureapp.jp |
| github-token   | OAuth token (if needed)          |                     |


### `ignores` field

list containing files and directories to ignore for release.


# tips
## with task runners

add `grunt-cli` to devDependencies

you can write `grunt` command without full path in npm.




# LICENSE
MIT
