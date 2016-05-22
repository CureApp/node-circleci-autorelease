// @flow

import fs from 'fs'
import yaml from 'js-yaml'
import {exec} from 'shelljs'
import WorkingDirectory from '../lib/working-directory'


function VERSION_MISMATCH(logVersion: string, bmpVersion: string): string {
    return `
--------------------------------------------------------
    Commit version is not consistent with bmp version.

        commit version : ${logVersion}
        bmp version    : ${bmpVersion}
--------------------------------------------------------
`
}

const NON_RELEASE_COMMIT_MESSAGE = `
----------------------------------------------------------------
    No release process is going to start, because
    the latest commit log is not the valid.
    Run one of the following command to get valid commit log.

        $(npm bin)/nca bmp p # patch level (0.0.1)
        $(npm bin)/nca bmp m # minor level (0.1.0)
        $(npm bin)/nca bmp j # major level (1.0.0)
        $(npm bin)/nca bmp r # re-release  (0.0.0)

    Valid commit log message formats are the followings.
    These are automatically set via the commands above.

        release X.Y.Z
        re-release X.Y.Z

----------------------------------------------------------------
`



export default class ReleasabilityChecker {

    /**
     * @public
     */
    check(cwd ?: string): ?string {
        const logVersion = this.getVersionFromLog()
        if (!logVersion) { return NON_RELEASE_COMMIT_MESSAGE }

        const bmpVersion = this.getVersionFromBmp(cwd)
        if (!bmpVersion) { return } // no bmp, no problem

        if (bmpVersion !== logVersion) {
            return VERSION_MISMATCH(logVersion, bmpVersion)
        }
        return
    }

    /**
     * @public
     */
    getVersionFromLog(): ?string {

        const commitMsg = this.exec('git log --pretty=format:"%s" -1', {silent: true}).stdout

        if (! commitMsg.match(/^(re-)?release +[0-9]+\./)) {
            return null
        }

        return commitMsg.split(/release +/)[1]
    }


    /**
     * @private
     */
    getVersionFromBmp(cwd ?: string): ?string {
        try {
            if (!cwd) cwd = new WorkingDirectory().resolve()
            const bmpYml = yaml.safeLoad(fs.readFileSync(cwd + '/.bmp.yml', 'utf8'))
            return bmpYml.version

        }
        catch (e) { // no bmp.yml not found
            return null
        }
    }

    exec(...args: Array<any>): Object {
        return exec(...args)
    }

}

