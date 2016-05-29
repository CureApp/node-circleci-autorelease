
import {ls, echo} from 'shelljs'
import exec from '../util/exec'
import yaml from 'js-yaml'

/**
 * Creator for gh-pages
 */
export default class GhPagesCreator {


    /**
     * @public
     */
    create(dir ?: string,
           remote ?: string = 'origin') {

        this.exec('git checkout --orphan gh-pages')

        if (dir) {

            this.exec('git reset')
            this.exec(`git add -f ${dir}`)
            this.exec('git clean -fdx')

            ls(dir).forEach(file => {
                this.exec(`git mv ${dir}/${file} .`)
            })
        }
        this.addCircleYml()

        this.exec('git commit -m "gh-pages"')
        this.exec(`git push --force ${remote} gh-pages`)
    }

    /**
     * Add circle.yml for gh-pages
     * @private
     */
    addCircleYml() {
        const ignoreGhPagesYml = {
            general: {branches: {ignore: ['gh-pages']}}
        }
        const ymlStr = yaml.dump(ignoreGhPagesYml, {indent: 2, lineWidth: 120})
        this.write('circle.yml', ymlStr)
        this.exec('git add -f circle.yml')
    }

    /**
     * Write a file with the content
     * @private
     */
    write(filename: string, content: string) {
        echo(content).to(filename)
    }

    /**
     * execute a given command
     * @private
     */
    exec(...args: Array<any>): Object {
        return exec(...args)
    }

}
