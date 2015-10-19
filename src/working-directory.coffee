fs = require 'fs'
path = require 'path'


class WorkingDirectory

    constructor: ->
        @path = process.cwd()


    resolve: ->
        while @inNodeModules() and @upperPackageHasSelf()
            @path = path.normalize @path + '/../..'

        return @path


    inNodeModules: ->

        path.basename(path.normalize @path + '/..') is 'node_modules'


    upperPackageHasSelf: ->

        upperPackagePath = path.normalize @path + '/../../package.json'

        unless fs.existsSync(upperPackagePath)
            return false

        packageJSON = require upperPackagePath

        packageJSON.devDependencies['node-circleci-autorelease'] or packageJSON.dependencies['node-circleci-autorelease']


module.exports = WorkingDirectory
