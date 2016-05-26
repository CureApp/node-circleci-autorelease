
import {ls} from 'shelljs'
import exec from '../util/exec'

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
            this.exec('add_circle_yml')
            this.exec(`git add -f ${dir}`)
            this.exec('git clean -fdx')

            ls(dir).forEach(file => {
                this.exec(`git mv ${dir}/${file} .`)
            })
        }

        this.exec('git commit -m "gh-pages"')
        this.exec(`git push --force ${remote} gh-pages`)
    }

    /**
     * execute a given command
     * @private
     */
    exec(...args: Array<any>): Object {
        return exec(...args)
    }

}
