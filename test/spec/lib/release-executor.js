// @flow
import ReleaseExecutor from '../../../src/lib/release-executor'
import assert from 'power-assert'

import fs from 'fs'
import {resolve} from 'path'
import {exec} from 'shelljs'

class ReleaseExecutor4t extends ReleaseExecutor {
    write: Function;
    exec: Function;
}

describe('ReleaseExecutor', function() {

    beforeEach(function() {
        const log = (v: string) => {}
        this.executedCommands = []
        this.executor = new ReleaseExecutor4t(log)
        this.executor.write = x => {}
        this.executor.exec = x => {
            this.executedCommands.push(x)
            return {
                stdout: 'stdout mock',
                stderr: 'stderr mock',
                code: 0
            }
        }
    })


    describe('release', function() {

        context('when only 1st argument is passed,', function() {

            beforeEach(function() {
                this.executor.release('v4.5.2')
            })

            it('should execute 9 commands', function() {
                assert(this.executedCommands.length === 9)
            })

            it('should create release branch', function() {
                assert(this.executedCommands[0] === 'git checkout -b release-v4.5.2')
            })

            it('should copy .releaseignore to .git/info/exclude', function() {
                assert(this.executedCommands[1] === 'cp .releaseignore .git/info/exclude')
            })

            it('should remove .gitignore', function() {
                assert(this.executedCommands[2] === 'git rm .gitignore')
            })

            it('should get ignored files by .releaseignore', function() {
                const expectedCommand = 'git ls-files --full-name -i --exclude-from .releaseignore'
                assert(this.executedCommands[3] === expectedCommand)

                const {stdout, stderr} = exec(expectedCommand, {silent: true})

                assert(stderr === '')

                const ignored = stdout.trim().split('\n')
                assert(ignored.length > 3)

                ignored.forEach(filename => {
                    const path = resolve(__dirname + '/../../../' + filename)
                    assert(fs.existsSync(path))
                })
            })

            it('should remove ignored files', function() {
                const prevResult = 'stdout mock'
                assert(this.executedCommands[4] === `git rm --cached ${prevResult}`)
            })

            it('should add all untracked changes, commit them, create a tag and push to origin', function() {
                assert(this.executedCommands[5] === 'git add -A')
                assert(this.executedCommands[6] === 'git commit -m v4.5.2')
                assert(this.executedCommands[7] === 'git tag v4.5.2')
                assert(this.executedCommands[8] === 'git push --force origin v4.5.2')
            })

            it('should all untracked changes', function() {
                assert(this.executedCommands[5] === `git add -A`)
            })

        })

        context('when 2nd argument:shrinkwrap is passed,', function() {

            beforeEach(function() {
                this.executor.release('v4.5.3', true)
            })

            it('should execute 13 commands', function() {
                assert(this.executedCommands.length === 13)
            })

            it('should run "npm shrinkwrap"', function() {
                assert(this.executedCommands[5] === 'rm -rf node_modules')
                assert(this.executedCommands[6] === 'npm install --production')
                assert(this.executedCommands[7] === 'npm shrinkwrap')
            })

            it('should re-install modules', function() {
                assert(this.executedCommands[12] === 'npm install')
            })
        })

        context('when 3nd argument:branch is passed,', function() {

            beforeEach(function() {
                this.executor.release('v4.5.4', null, true)
            })

            it('should execute 12 commands', function() {
                assert(this.executedCommands.length === 12)
            })

            it('should add circle.yml, commit it and push it', function() {
                assert(this.executedCommands[9] === 'git add -f circle.yml')
                assert(this.executedCommands[10] === 'git commit --allow-empty -m "add circle.yml for release"')
                assert(this.executedCommands[11] === 'git push --force origin release-v4.5.4')
            })
        })

        context('when 4th argument:remote is passed,', function() {

            beforeEach(function() {
                this.executor.release('v4.5.5', null, null, 'github')
            })

            it('should push to the given location', function() {
                assert(this.executedCommands[8] === 'git push --force github v4.5.5')
            })
        })
     })

    describe('publishNpm', function() {

        beforeEach(function() {
            this.write = (filename, content) => {
                assert(filename === '.npmrc')
                assert(content === '_auth=xyz\nemail=x@g.com\n')
            }
        })


        it('should return version when npm publish succeeded', function() {

            this.executor.exec = x => {
                return { stdout: 'node-circleci-autorelease@0.1.2', code: 0 }
            }
            assert(this.executor.publishNpm('x@g.com', 'xyz') === '0.1.2')
        })

        it('should return null when npm publish failed', function() {

            this.executor.exec = x => {
                return { stderr: '403', code: 1 }
            }
            assert(this.executor.publishNpm('x@g.com', 'xyz') === null)
        })

        it('should add .npmignore and publish', function() {

            this.executor.publishNpm('x@g.com', 'xyz')

            assert(this.executedCommands[0] === 'cp .releaseignore .npmignore')
            assert(this.executedCommands[1] === 'npm publish')
            assert(this.executedCommands[2] === 'rm .npmignore')
        })
    })
})
