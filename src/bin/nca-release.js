/*eslint no-console: 0 */
// @flow

import program from 'commander'
import chalk from 'chalk'
import ReleasabilityChecker from '../lib/releasability-checker'
import ReleaseExecutor from '../lib/release-executor'


export default function run() {

    program
        .option('--prefix <version prefix>', 'version prefix')
        .option('--branch', 'create branch')
        .option('--shrinkwrap', 'make shrinkwrap.json')
        .parse(process.argv)

    const {prefix, branch, shrinkwrap} = program

    const checker = new ReleasabilityChecker()
    if (!checker.isReleasable) {
        console.error(chalk.yellow(checker.warnMessage))
        return process.exit(0)
    }
    const version = prefix + checker.logVersion

    // release
    const executor = new ReleaseExecutor(console.log)
    const result = executor.release(version, shrinkwrap, branch)
    if (result) {
        console.log(chalk.green(`The tag "${version}" was successfully released.`))
    }
    else {
        const { CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME } = process.env
        console.log(chalk.red(SHOW_HOW_TO_RELEASE_IN_CIRCLE_CI(CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME)))
        process.exit(1)
    }

    // npm publish
    const {NPM_EMAIL, NPM_AUTH} = process.env
    if (NPM_EMAIL && NPM_AUTH) {
        const npmPublishResult = executor.publishNpm(NPM_EMAIL, NPM_AUTH)
        if (npmPublishResult) {
            console.log(chalk.green(`npm publish "${checker.logVersion}" succeeded.`))
        }
        else {
            console.log(chalk.red(`npm publish "${checker.logVersion}" failed.`))
        }
    }
    else {
        const { CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME } = process.env
        console.log(SHOW_HOW_TO_NPM_PUBLISH(CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME))
    }
}


const SHOW_HOW_TO_RELEASE_IN_CIRCLE_CI = (userName: string, repoName: string): string => `
----------------------------------------------------------------------
    Release failed.

    In most cases, it is due to the ssh key registered in CircleCI.
    Check the key have permission to write to github.

    https://circleci.com/gh/${userName}/${repoName}/edit#checkout

----------------------------------------------------------------------
`


const SHOW_HOW_TO_NPM_PUBLISH = (userName: string, repoName: string): string => `
-----------------------------------------------------------------------------------------------------
    'npm publish' was not executed as $NPM_AUTH and $NPM_EMAIL environment variables does not exist.

    Set it at
        https://circleci.com/gh/${userName}/${repoName}/edit#env-vars

    Name: NPM_AUTH
    Value: (value of '_auth' at your .npmrc after 'npm login')

    Name: NPM_EMAIL
    Value: (your email registered to npm)
-----------------------------------------------------------------------------------------------------
`

if (require.main === module) run()
