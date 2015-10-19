fs = require 'fs'
path = require 'path'


class WorkingDirectory

    constructor: ->
        @path = process.cwd()


    resolve: ->
        if @inNodeModules() and @upperPackageJSON()
            @path = path.normalize @path + '/../..'

        return @path


    inNodeModules: ->

        path.basename(path.normalize @path + '/..') is 'node_modules'


    upperPackageJSON: ->

        upperPackagePath = path.normalize @path + '/../../package.json'

        fs.existsSync(upperPackagePath)


module.exports = WorkingDirectory
