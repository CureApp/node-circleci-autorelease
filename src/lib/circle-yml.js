// @flow

import merge from 'deepmerge'
import yaml from 'js-yaml'
import type AutoreleaseYml from './autorelease-yml'

export default class CircleYml {

    /**
     * @public
     */
    static generate(arYml: AutoreleaseYml): string {

        const standard = this.standard(arYml)
        const custom = arYml.circle

        const merged = merge(standard, custom)
        return yaml.dump(merged, {indent: 4, lineWidth: 120})
    }


    /**
     * @private
     */
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
                post: flat(
                    arYml.hooks('update_modules', 'pre'),
                    this.updateModulesCommand(arYml.config('npm_update_depth')),
                    arYml.hooks('update_modules', 'post')
                )
            },

            deployment: {
                create_release_branch: {
                    branch: ['master'],
                    commands: flat(
                        arYml.hooks('release', 'pre'),
                        this.releaseCommand(arYml),
                        arYml.hooks('release', 'post'),

                        arYml.hooks('gh_pages', 'pre'),
                        this.ghPagesCommand(arYml.config('create_gh_pages'), arYml.config('gh_pages_dir')),
                        arYml.hooks('gh_pages', 'post'),
                    )
                }
            }
        }
    }

    /**
     * generate command to update node_modules
     * @private
     */
    static updateModulesCommand(depth: primitive): string {
        if (!depth) {
            return '$(npm bin)/nca notice update-modules'
        }
        return `$(npm bin)/nca update-modules --depth ${depth}`
    }

    /**
     * generate command to release
     * @private
     */
    static releaseCommand(arYml: AutoreleaseYml): string {
        const options = {
            prefix:       arYml.config('version_prefix'),
            branch:     !!arYml.config('create_branch'),
            shrinkwrap: !!arYml.config('npm_shrinkwrap')
        }
        return '$(npm bin)/nca release ' + this.optionStr(options)
    }


    /**
     * generate command to create gh-pages branch
     * @private
     */
    static ghPagesCommand(create: primitive, dir: primitive): string {

        if (!create) {
            return '$(npm bin)/nca notice gh-pages'
        }

        return `$(npm bin)/nca gh-pages --dir ${dir}`
    }

    /**
     * generate command line option string
     * @private
     */
    static optionStr(options: Object): string {

        return Object.keys(options).map(key => {

            const val = options[key]

            if (typeof val === 'boolean') { return val ? `--${key}` : '' }

            return val != null ? `--${key} ${val}` : ''
        })
        .filter(v => v)
        .join(' ')
    }

}


function flat(...args) {
    return args.reduce((arr, v) => {
        if (Array.isArray(v)) {
            return arr.concat(flat(...v))
        }
        else {
            arr.push(v)
        }
        return arr
    }, [])
}
