// @flow
import fs from 'fs'

/**
 * Loader for package.json
 */
export default class PackageJSONLoader {

    /**
     * load package.json of the given path
     * @param cwd project root dir
     */
    static load(cwd: string) {

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
