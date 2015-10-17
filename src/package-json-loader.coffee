
fs = require 'fs'

class PackageJSONLoader

    @load: (cwd) ->

        path = cwd + '/package.json'

        unless fs.existsSync(path)
            throw new Error(path + ' is not found.')

        try
            return require path

        catch e
            throw new Error(path + ': parse error.\n' + e.message)


    @save: (cwd, content) ->

        path = cwd + '/package.json'

        fs.writeFileSync(path, JSON.stringify content, null, 2)



module.exports = PackageJSONLoader
