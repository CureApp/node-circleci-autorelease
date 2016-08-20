// @flow

import fs from 'fs'
import exec from '../util/exec'

/**
 * Executes release process
 */
export default class ReleaseExecutor {
    log: (a: string) => void;


    constructor(log: (a: string) => void) {
        this.log = log
    }

    /**
     * Release the version
     * @public
     * @param version version name formatted as X.Y.Z
     * @param shrinkwrap  [] whether or not to run `npm shrinkwrap`
     * @param branch  whether or not to release branch
     */
    release(version: string,
            shrinkwrap: boolean = false,
            branch: boolean = false,
            remote: string = 'origin'): boolean {

        this.exec(`git checkout -b release-${version}`)
        this.ignoreFiles()

        if (shrinkwrap) {
            this.addShrinkwrap()
        }

        this.exec('git add -A')
        this.exec(`git commit -m ${version}`)
        this.exec(`git tag ${version}`)
        const {code} = this.exec(`git push --force ${remote} ${version}`)
        if (!this.isPushSucceeded(code)) {
            return false
        }

        if (branch) {
            this.pushReleaseBranch(version, remote)
        }

        // re-install dev-dependent modules
        if (shrinkwrap) {
            this.log('---- re-installing node_modules after shrinkwrap ----')
            this.exec('npm install')
        }
        return true
    }

    /**
     * publish npm
     * @public
     */
    publishNpm(email: string,
               auth: string,
               path?: string = '.npmrc'): ?string {

        const npmrc = `_auth=${auth}\nemail=${email}\n`
        this.write(path, npmrc)
        this.exec('cp .releaseignore .npmignore')
        const {stdout, code} = this.exec('npm publish')
        this.exec('rm .npmignore')
        this.exec('rm .npmrc')

        return code === 0 ? stdout.trim().split('@')[1] : null
    }

     /**
     * ignore files in .releaseignore
     * @private
     */
    ignoreFiles() {
        this.exec('cp .releaseignore .git/info/exclude')
        this.exec('git rm .gitignore')

        const filesToRemove = this.exec('git ls-files --full-name -i --exclude-from .releaseignore').stdout

        if (filesToRemove) {
            for (const file of filesToRemove.trim().split('\n')) {
                this.exec(`git rm --cached ${file}`)
            }
        }
    }

    /**
     * Add shrinkwrap.json before release
     *
     * On npm v2,
     *
     *  - `npm shrinkwrap` omits dev-dependent modules
     *  -  wrongly omits dev-dependent modules which are sub-dependent
     *
     *  On npm v3,
     *  - `npm shrinkwrap` includes some (not all) of dev-dependent modules
     *  - after `npm prune --production`, it's ok
     *
     *  Currenlty, the following process is the only way to get the correct result on npm >=v2.
     *
     *  ```sh
     *  rm -rf node_modules
     *  npm install --production
     *  npm shrinkwrap
     *  ```
     * @see https://github.com/npm/npm/issues/11189
     *
     * @private
     */
    addShrinkwrap() {
        this.exec('rm -rf node_modules')
        this.exec('npm install --production')
        this.exec('npm shrinkwrap')
    }

    /**
     * @check if push succeeded
     * @private
     */
    isPushSucceeded(code: number): boolean {
        return code === 0
    }

    /**
     * push release branch after pushing tag
     * @private
     */
    pushReleaseBranch(version: string, remote: string) {
        this.exec('git add -f circle.yml')
        this.exec('git commit --allow-empty -m "add circle.yml for release"')
        this.exec(`git push --force ${remote} release-${version}`)
    }


    /**
     * Write a file with the content
     * @private
     */
    write(filename: string, content: string) {
        fs.writeFileSync(process.cwd() + '/' + filename, content)
    }

    /**
     * execute a given command
     * @private
     */
    exec(...args: Array<any>): Object {
        return exec(...args)
    }
}
