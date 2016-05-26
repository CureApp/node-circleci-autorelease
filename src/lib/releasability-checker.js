// @flow

import exec from '../util/exec'


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

/**
 * Checker for releasability
 */
export default class ReleasabilityChecker {

    /**
     * @public
     */
    check(): ?string {
        const logVersion = this.getVersionFromLog()
        if (!logVersion) { return NON_RELEASE_COMMIT_MESSAGE }
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


    exec(...args: Array<any>): Object {
        return exec(...args)
    }

}

