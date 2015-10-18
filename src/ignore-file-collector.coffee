
fs = require 'fs'

PackageJSONLoader = require './package-json-loader'

###*
create yml

@class IgnoreFileCollector
###
class IgnoreFileCollector

    ###*
    add scripts and custom fields to package.json

    @method run
    @static
    ###
    @run: ->
        filename = process.cwd() + '/circle.yml'
        files = new @(process.cwd()).collect()
        console.log files.join('\n')


    ###*
    @constructor
    @param {String} cwd current working directory
    ###
    constructor: (@cwd) ->


    ###*
    collect ignore files from package.json and .releaseignore
    @method collect
    @public
    @return {Array(String)} files
    ###
    collect: ->

        @loadFromPackgeJSON().concat @loadFromReleaseIgnore()


    ###*
    get ignore files from package.json
    @method loadFromPackgeJSON
    @private
    ###
    loadFromPackgeJSON: ->

        packageJSON = PackageJSONLoader.load(@cwd)

        setting = packageJSON['node-circleci-autorelease'] ? {}

        return setting.ignores ? []


    ###*
    get ignore files from .releaseignore
    @method loadFromReleaseIgnore
    @private
    ###
    loadFromReleaseIgnore: ->

        file = @cwd + '/.releaseignore'

        unless fs.existsSync file
            return []

        return fs.readFileSync(file, 'utf8').trim().split('\n')


module.exports = IgnoreFileCollector
