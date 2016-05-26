/*eslint no-console: 0 */
// @flow

import program from 'commander'

export default function run() {

    program
        .arguments('<msg-type>')
        .parse(process.argv)

    switch (program.args[0]) {
    case 'gh-pages':
        console.log(GH_PAGES_BRANCH_WAS_NOT_CREATED)
        return

    case 'update-modules':
        console.log(UPDATE_MODULES_WERE_NOT_EXECUTED)
        return
    }


}

const GH_PAGES_BRANCH_WAS_NOT_CREATED = `
--------------------------------------------------------
Branch "gh-pages" was not created.
If you would like to create it, edit .autorelease.yml
like the code below.

    config:
      create_gh_pages: true
      gh_pages_dir: doc # directory to host in gh-pages

--------------------------------------------------------
`

const UPDATE_MODULES_WERE_NOT_EXECUTED = `
--------------------------------------------------------
Dependent node_modules were not updated.
If you would like to update them, edit .autorelease.yml
like the code below.

    config:
      npm_update_depth: 4 # greater than 0 -> updated

--------------------------------------------------------
`


if (require.main === module) run()
