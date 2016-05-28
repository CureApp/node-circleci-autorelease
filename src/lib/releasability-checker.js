// @flow

import exec from '../util/exec'


const NON_RELEASE_COMMIT_MESSAGE = `
----------------------------------------------------------------
    No release process is going to start, because
    the latest commit log is not valid.
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
    __commitMsg: ?string;

    constructor() {
        this.__commitMsg = null // cache
    }

    /**
     * @public
     */
    get isReleasable(): ?boolean {
        return this.logVersion != null
    }

    /**
     * @public
     */
    get warnMessage(): ?string {
        if (!this.logVersion) { return NON_RELEASE_COMMIT_MESSAGE }
    }

    get commitMsg(): string {
        return this.__commitMsg || this.exec('git log --pretty=format:"%s" -1', {silent: true}).stdout
    }

    /**
     * @public
     */
    get logVersion(): ?string {
        if (! this.commitMsg.match(/^(re-)?release +[0-9]+\./)) {
            return null
        }

        return this.commitMsg.split(/release +/)[1]
    }


    exec(...args: Array<any>): Object {
        return exec(...args)
    }

}

