import GhPagesCreator from '../../../src/lib/gh-pages-creator'
import assert from 'power-assert'

import fs from 'fs'
import {resolve} from 'path'
import {exec} from 'shelljs'

describe('GhPagesCreator', function() {

    beforeEach(function() {

        this.executedCommands = []
        this.creator = new GhPagesCreator()
        this.creator.exec = x => {
            this.executedCommands.push(x)
            return {
                stdout: 'stdout mock',
                stderr: 'stderr mock',
                code: 0
            }
        }
    })

    describe('create', function() {

        context('when no dir is given,', function() {

            it('should release gh-pages branch the same as master', function() {
                this.creator.create()
                assert.deepEqual(this.executedCommands, [
                    'git checkout --orphan gh-pages',
                    'git commit -m "gh-pages"',
                    'git push --force origin gh-pages',
                ])
            })
        })

        context('when dir is given,', function() {

            it('should release gh-pages only the given dir', function() {
                this.creator.create('test/spec/data/doc')

                assert.deepEqual(this.executedCommands, [
                    'git checkout --orphan gh-pages',
                    'git reset',
                    'add_circle_yml',
                    'git add -f test/spec/data/doc',
                    'git clean -fdx',
                    'git mv test/spec/data/doc/abc.txt .',
                    'git mv test/spec/data/doc/xyz.txt .',
                    'git commit -m "gh-pages"',
                    'git push --force origin gh-pages'
                ])
            })
        })
    })
})
