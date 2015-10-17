

fs = require 'fs'
PackageJSONLoader = require './package-json-loader'

###*
create yml

@class Installer
###
class Installer

    ###*
    add scripts and custom fields to package.json

    @method run
    @static
    ###
    @run: ->
        filename = process.cwd() + '/circle.yml'
        content = new @(process.cwd()).install()
        fs.writeFileSync(filename, content)


    ###*
    @constructor
    @param {String} cwd current working directory
    ###
    constructor: (@cwd) ->

        @packageJSON = PackageJSONLoader.load(@cwd)


    ###*
    attach scripts and custom fields to package.json
    @method install
    @public
    ###
    install: ->
        @attachScripts()
        @attachCustomFields()
        PackageJSONLoader.save(@cwd, @packageJSON)


    ###*
    attach scripts
    @method attachScripts
    @private
    ###
    attachScripts: ->

        newScripts =
            'bmp-p'             : 'cc-bmp -p'
            'bmp-m'             : 'cc-bmp -m'
            'bmp-j'             : 'cc-bmp -j'
            'bmp-j'             : 'cc-bmp -j'
            'circle'            : 'cc-generate-yml'
            'post-dependencies' : 'echo post-dependencies'
            'pre-release'       : 'echo pre-release'

        existingScripts = @packageJSON.scripts ? {}

        @setNonExistingValues(existingScripts, newScripts)

        @packageJSON.scripts = existingScripts




    ###*
    attach custom fields ('node-circleci-autorelease')
    @method attachCustomFields
    @private
    ###
    attachCustomFields: ->

        config =
            'git-user-name'  : 'CircleCI'
            'git-user-email' : 'circleci@cureapp.jp'
            'github-token'   : ''

        defaultIgnores = [
            'node_modules'
            '.gitignore'
            '.editorconfig'
            'spec'
            'README.md'
            '.releaseignore'
            '.bmp.yml'
            'npm-debug.log'
        ]

        setting = @packageJSON['circleci-autorelease'] ? { config: {} }

        @setNonExistingValues(setting.config, config)
        setting.ignores ?= defaultIgnores

        @packageJSON['circleci-autorelease'] = setting


    ###*
    attach values to object
    @method setNonExistingValues
    @private
    ###
    setNonExistingValues: (original = {}, newObj = {}) ->

        for key, value of newObj
            if not original[key]?
                console.log "appending #{key}: '#{value}' to package.json"
                original[key] = value


module.exports = Installer
