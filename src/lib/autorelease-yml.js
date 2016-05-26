// @flow

import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'


export default class AutoreleaseYml {

    __data: Object
    loaded: boolean

    static filename = '.autorelease.yml'


    /**
     * default values, used when no file exists
     */
    static get defaultValues() {
        return {
            hooks: {
                update_modules: { pre: ['echo "before update-modules"'], post: ['echo "after update-modules"'] },
                release: { pre: ['echo "before release"'], post: ['echo "after release"'] },
                gh_pages: { pre: ['echo "before gh-pages"'], post: ['echo "after gh-pages"'] }
            },
            config: this.defaultConfig,
            circle: {}
        }
    }

    /**
     * default configs
     */
    static get defaultConfig() {
        return {
            git_user_name: 'CircleCI',
            git_user_email: 'circleci@example.com',

            // options for PATH, enable to run executables in node_modules/.bin without prefix
            npm_bin_path: true,

            // options for nca update-modules
            npm_update_depth: 0,

            // options for nca release
            version_prefix: 'v',
            create_branch: false,
            npm_shrinkwrap: false,

            // options for nca gh-pages
            create_gh_pages: false,
            gh_pages_dir: null,

        }
    }

    /**
     * load yml file in the given directory
     * @public
     */
    static loadFromDir(dirPath: string): AutoreleaseYml {
        const path = join(dirPath, this.filename)
        return new AutoreleaseYml(path)
    }


    constructor(path: string) {

        this.loaded = false

        try {
            this.__data = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
            this.loaded = true
        }
        // if .autorelease.yml is not found, silently prepare a default object
        catch (e) {
            this.__data = this.constructor.defaultValues
        }
    }


    /**
     * get hook commands
     * @public
     */
    hooks(name: string, timing: string): Array<string> {
        if (!this.hookNames.includes(name)) throw new Error(`Invalid hook name: "${name}" was given.`)
        if (!this.__data.hooks) return []
        const hookObjs = this.__data.hooks[name]
        if (!hookObjs) return []

        const hooks = hookObjs[timing]
        return Array.isArray(hooks) ? hooks : hooks ? [hooks] : []
    }


    /**
     * @public
     */
    config(key: string): primitive {
        const val = this.__data.config ? this.__data.config[key] : undefined
        return (val != null)? val : this.constructor.defaultConfig[key]
    }

    /**
     * @public
     */
    get circle(): Object {
        return Object.assign({}, this.__data.circle)
    }

    /**
     * get YAML format
     */
    toString(): string {
        return yaml.dump(this.__data, {indent: 2, lineWidth: 120})
    }

    /**
     * save .autorelease.yml to the given directory
     */
    saveTo(dir: string) {
        const path = join(dir, this.constructor.filename)
        fs.writeFileSync(path, this.toString())
    }

    /**
     * check format of autorelease.yml
     * @public
     */
    checkFormat() {

        if (!this.__data) throw new Error('Yaml has not been loaded.')

        Object.keys(this.__data).forEach(name => {
            if (! this.rootFieldNames.includes(name)) {
                throw new Error(`Unknown field: "${name}"`)
            }
        })

        const { hooks, config, circle } = this.__data

        if (hooks) this.checkHooksFormat(hooks)
        if (config) this.checkConfigFormat(config)
        if (circle) this.checkCircleFormat(circle)
    }


    /**
     * @private
     */
    get rootFieldNames(): Array<string> {
        return ['hooks', 'config', 'circle']
    }



    /**
     * @private
     */
    get hookNames(): Array<string> {
        return ['update_modules', 'release', 'gh_pages']
    }

    /**
     * @private
     */
    get configNames(): Array<string> {
        return Object.keys(this.constructor.defaultConfig)
    }



    /**
     * @private
     */
    checkHooksFormat(hooks: Object) {

        Object.keys(hooks).forEach(name => {
            if (! this.hookNames.includes(name)) {
                throw new Error(`Unknown field: "hooks.${name}"`)
            }

            if (!hooks[name].pre && !hooks[name].post) {
                throw new Error(`Field not found: "hooks.${name}.pre" or "hooks.${name}.post" is required.`)
            }

            Object.keys(hooks[name]).forEach(subname => {
                if (! ['pre', 'post'].includes(subname)) {
                    throw new Error(`Unknown field: "hooks.${name}.${subname}"`)
                }
                this.checkHookCommandFormat(hooks[name][subname], name, subname)
            })
        })
    }


    /**
     * @private
     */
    checkHookCommandFormat(cmds: any, name: string, subname: string) {
        if (typeof cmds === 'string') {
            return
        }

        if (Array.isArray(cmds)) {
            if (typeof cmds === 'string') {
                return
            }
            return
        }

        throw new Error(`Invalid type: "hooks.${name}.${subname}". It should be an array or a string.`)
    }


    /**
     * @private
     */
    checkConfigFormat(config: Object) {
        Object.keys(config)

        .filter(name => config[name] != null)
        .forEach(name => {
            if (!this.configNames.includes(name)) {
                throw new Error(`Unknown field: "config.${name}"`)
            }

            if (typeof config[name] === 'object') {
                throw new Error(`Invalid type: "config.${name}". "It should not be an object."`)
            }

        })
    }

    /**
     * @private
     */
    checkCircleFormat(circle: Object) {
        if (!circle) return

        // TODO
        return
    }


}
