// @flow

import merge from 'deepmerge'
import yaml from 'js-yaml'
import AutoreleaseYml from './autorelease-yml' // TODO Remove this row. This import is only required for ESLint.

export default class CircleYml {

    static generate(arYml: AutoreleaseYml): String {

        const standard = this.standard(arYml)
        const custom = arYml.circle

        const merged = merge(standard, custom)
        return yaml.dump(merged, {indent: 4, lineWidth: 120})
    }


    static standard(arYml: AutoreleaseYml): Object {
        return {
            general: {
                branches: {
                    ignore: [ 'gh-pages', '/release.*/' ]
                }
            },

            machine: {
                environment: this.environment(arYml.config),
                post: [
                    'git config --global user.name ${GIT_USER_NAME}',
                    'git config --global user.email ${GIT_USER_EMAIL}'
                ],
            },

            dependencies: {
                post: ['$(npm bin)/nca update-npm']
            },

            deployment: {
                create_release_branch: {
                    branch: ['master'],
                    commands: [
                        '$(npm bin)/nca release',
                        '$(npm bin)/nca gh-pages',
                    ]
                }
            }
        }
    }

    static environment(arConfig: Object): Object {

        let values = {
            GIT_USER_NAME: 'CircleCI',
            GIT_USER_EMAIL: 'circleci@cureapp.jp',
            VERSION_PREFIX: 'v',
            CREATE_BRANCH: 1,
            GH_PAGES_DIR: 'doc',
            NPM_SHRINKWRAP: 1,
            NPM_UPDATE_DEPTH: 9999
        }

        Object.keys(arConfig).forEach(key => {
            const KEY = key.toUpperCase()
            values[KEY] = arConfig[key]
        })

        return values
    }
}
