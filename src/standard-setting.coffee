
module.exports =

    get: ->

        general:
            ignore: [ 'gh-pages', '/release.*/' ]

        machine:
            environment:
                PATH: '$PATH:$HOME/$CIRCLE_PROJECT_REPONAME/node_modules/node-circleci-autorelease/bin'

        dependencies:

            post: [ 'npm run post-dependencies' ]


        deployment:

            create_release_branch:
                branch:  [ 'master' ]
                commands: [
                    'cc-prepare-for-release && npm run pre-release && cc-release || cc-not-released'
                ]

            gh_pages:
                branch:  [ 'master' ]
                commands: [
                    'npm run gh-pages && cc-gh-pages'
                ]

