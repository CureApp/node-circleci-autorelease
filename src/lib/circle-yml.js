// @flow

import merge from 'deepmerge'
import yaml from 'js-yaml'
import type AutoreleaseYml from './autorelease-yml'

export default class CircleYml {

    static generate(arYml: AutoreleaseYml): string {

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
                pre: [
                    `git config --global user.name "${arYml.config('git_user_name')}"`,
                    `git config --global user.email "${arYml.config('git_user_email')}"`
                ],
            },

            dependencies: {
                post: this.updateModulesCommand(arYml.config('npm_update_depth'))
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

    static updateModulesCommand(depth: primitive): ?Array<string> {
        if (!depth) { return }
        return ['$(npm bin)/nca update-modules']
    }

}
