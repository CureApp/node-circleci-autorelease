
module.exports =

    get: ->

        general:
            branches:
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
                    'npm run gh-pages && cc-gh-pages'
                ]
