/*eslint no-console: 0 */
// @flow

import program from 'commander'
import chalk from 'chalk'
import GhPagesCreator from '../lib/gh-pages-creator'


export default function run() {

    program
        .arguments('<bump-level>', /[pmjr]/)
        .option('--dir <directory>', 'directory to host')
        .parse(process.argv)

    const {dir} = program

    if (!dir) {
        console.log(HOW_TO_HOST_SPECIFIC_DIR)
    }

    new GhPagesCreator().create(dir)
}

const HOW_TO_HOST_SPECIFIC_DIR = `
    All files in master branch will be added to gh-pages.
    Set 'config.gh_pages_dir' in .autorelease.yml.
    Then, only the contents of the directory are added to gh-pages.
`

if (require.main === module) run()
