

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
        new @(process.cwd()).install()


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

        @createReleaseIgnore()



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
            'post-release'      : 'echo post-release'
            'gh-pages'          : 'echo gh-pages'

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
            'git-user-name'   : 'CircleCI'
            'git-user-email'  : 'circleci@cureapp.jp'
            'version-prefix'  : 'v'
            'create-branch'   : false
            'create-gh-pages' : false
            'gh-pages-dir'    : 'doc'

        setting = @packageJSON['node-circleci-autorelease'] ? { config: {} }

        @setNonExistingValues(setting.config, config)

        @packageJSON['node-circleci-autorelease'] = setting


    ###*
    attach values to object
    @method setNonExistingValues
    @private
    ###
    setNonExistingValues: (original = {}, newObj = {}) ->

        for key, value of newObj when not original[key]?
            console.log "appending #{key}: '#{value}' to package.json"
            original[key] = value




    createReleaseIgnore: ->

        filename = @cwd + '/.releaseignore'

        return if fs.existsSync filename

        defaultIgnores = [
            'node_modules'
            '.editorconfig'
            'spec'
            '.releaseignore'
            '.bmp.yml'
            'npm-debug.log'
        ]

        fs.writeFileSync(filename, defaultIgnores.join('\n') + '\n')

        console.log 'creating a file: .releaseignore'



module.exports = Installer
