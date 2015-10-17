
module.exports =

    get: ->

        machine:
            environment:
                PATH: '$PATH:$HOME/$CIRCLE_PROJECT_REPONAME/node_modules/node-circleci-autorelease/bin'

        dependencies:

            post: [ 'npm run post-dependencies' ]


        deployment:

            create_release_branch:
                branch:  [ 'master' ]
                commands: [
                    'cc-check-commit-message && npm run pre-release && cc-release || cc-ok'
                ]
