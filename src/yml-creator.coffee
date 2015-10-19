
yaml = require 'js-yaml'
merge = require 'deepmerge'
fs = require 'fs'

PackageJSONLoader = require './package-json-loader'

###*
create yml

@class YmlCreator
###
class YmlCreator

    ###*
    save circle.yml to current working directory

    @method run
    @static
    ###
    @run: ->
        filename = process.cwd() + '/circle.yml'
        content = new @(process.cwd()).create()
        fs.writeFileSync(filename, content)


    ###*
    @constructor
    @param {String} cwd current working directory
    ###
    constructor: (@cwd) ->

        @setting = require('./standard-setting').get()

        @packageJSON = PackageJSONLoader.load(@cwd)



    ###*
    create yml
    @method create
    @public
    ###
    create: ->

        custom = @packageJSON['node-circleci-autorelease'] ? {}

        { config, ignores } = custom

        delete custom.config
        delete custom.ignores

        @attachNodeEngine()

        @attachConfig(config)

        merged = merge(@setting, custom)

        return yaml.dump merged, indent: 4



    ###*
    attach node version information from package.json

    @method attachNodeEngine
    @private
    ###
    attachNodeEngine: ->

        if @packageJSON.engines?.node

            @setting.machine.node =
                version: @packageJSON.engines.node


    ###*
    attach config (git information, prefix, etc..) to yml

    @method attachConfig
    @private
    ###
    attachConfig: (config = {}) ->

        if config['git-user-name'] and config['git-user-email']

            @setting.machine.pre = [
                "git config --global user.name '#{config['git-user-name']}'"
                "git config --global user.email '#{config['git-user-email']}'"
            ]

        if config['version-prefix']?
            @setting.machine.environment.VERSION_PREFIX = config['version-prefix']


        if config['create-branch']
            @setting.machine.environment.CREATE_BRANCH = 1


        if config['create-gh-pages']
            @setting.machine.environment.CREATE_GH_PAGES = 1


        if config['gh-pages-dir']
            @setting.machine.environment.GH_PAGES_DIR = config['gh-pages-dir']


module.exports = YmlCreator
