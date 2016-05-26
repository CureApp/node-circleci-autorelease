// @flow

import fs from 'fs'
import exec from '../util/exec'

export default class ReleaseExecutor {

    /**
     * Release the version
     * @public
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
        return true
    }

    /**
     * publish npm
     * @public
     */
    publishNpm(email: string,
               auth: string,
               path?: string = '~/.npmrc') {

        const npmrc = `_auth=${auth}\nemail=${email}\n`
        fs.writeFileSync(path, npmrc)

        this.exec('cp .releaseignore .npmignore')
        this.exec('npm publish')
        this.exec('rm .npmignore')
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
            this.exec(`git rm --cached ${filesToRemove}`)
        }
    }

    /**
     * add shrinkwrap.json before release
     * @private
     */
    addShrinkwrap() {
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
     * execute a given command
     * @private
     */
    exec(...args: Array<any>): Object {
        return exec(...args)
    }
}
