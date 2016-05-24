// @flow
import fs from 'fs'

export default class PackageJSONLoader {

    static load(cwd) {

        const path = cwd + '/package.json'

        if (!fs.existsSync(path)) {
            throw new Error(path + ' is not found.')
        }

        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'))

        } catch (e) {
            throw new Error(path + ': parse error.\n' + e.message)
        }
    }


    static save(cwd, content) {

        const path = cwd + '/package.json'

        return fs.writeFileSync(path, JSON.stringify(content, null, 2) + '\n')
    }
}
