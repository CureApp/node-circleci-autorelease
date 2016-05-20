import fs from 'fs'

class PackageJSONLoader {

    static load(cwd) {

        let path = cwd + '/package.json'

        if (!fs.existsSync(path)) {
            throw new Error(path + ' is not found.')
        }

        try {
            return require(path)

        } catch (e) {
            throw new Error(path + ': parse error.\n' + e.message)
        }
    }


    static save(cwd, content) {

        let path = cwd + '/package.json'

        return fs.writeFileSync(path, JSON.stringify(content, null, 2) + '\n')
    }
}



export default PackageJSONLoader
