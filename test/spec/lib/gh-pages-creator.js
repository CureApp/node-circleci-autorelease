// @flow
import GhPagesCreator from '../../../src/lib/gh-pages-creator'
import assert from 'power-assert'

import fs from 'fs'
import {resolve} from 'path'
import {exec} from 'shelljs'
import yaml from 'js-yaml'
const ymlStr = yaml.dump({general: {branches: {ignore: ['gh-pages']}}}, {indent: 2})

describe('GhPagesCreator', function() {

    beforeEach(function() {

        this.executedCommands = []
        this.creator = new GhPagesCreator()

        this.creator.write = (filename, content) => {
            assert(filename === 'circle.yml')
            assert(content === ymlStr)
        }

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
                    'git add -f circle.yml',
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
                    'git add -f test/spec/data/doc',
                    'git clean -fdx',
                    'git mv test/spec/data/doc/abc.txt .',
                    'git mv test/spec/data/doc/xyz.txt .',
                    'git add -f circle.yml',
                    'git commit -m "gh-pages"',
                    'git push --force origin gh-pages'
                ])
            })
        })
    })
})
