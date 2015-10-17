
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

        return yaml.safeDump merged, indent: 4



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
    attach config (git information) to yml

    @method attachConfig
    @private
    ###
    attachConfig: (config = {}) ->

        if config['git-user-name'] and config['git-user-email']

            @setting.machine.pre = [
                "git config --global user.name '#{config['git-user-name']}'"
                "git config --global user.email '#{config['git-user-email']}'"
            ]

        if config['github-token']
            @setting.machine.environment.GITHUB_TOKEN = config['github-token']


module.exports = YmlCreator
