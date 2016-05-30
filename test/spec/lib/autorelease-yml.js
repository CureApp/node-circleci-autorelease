// @flow
import AutoreleaseYml from '../../../src/lib/autorelease-yml'
import assert from 'power-assert'
import fs from 'fs'
import yaml from 'js-yaml'
import {resolve} from 'path'


describe('AutoreleaseYml', function() {

    before(function() {
        this.dataDir = resolve(__dirname + '/../data')
        this.path = resolve(__dirname + '/../data/.autorelease.yml')
        this.data = yaml.safeLoad(fs.readFileSync(this.path, 'utf8'))
    })


    describe('loadFromDir',function() {

        it('can load .autorelease.yml file with a given directory', function() {
            const arYml = AutoreleaseYml.loadFromDir(this.dataDir)
            assert.deepEqual(arYml.__data, this.data)
        })
    })



    describe('checkFormat',function() {

        it('should be ok when no file exists', function() {
            const arYml = new AutoreleaseYml('invalid path')
            assert.doesNotThrow(x => { arYml.checkFormat() })
        })


        it('should be ok with empty data', function() {
            const arYml = new AutoreleaseYml(this.path)
            arYml.__data = {}

            assert.doesNotThrow(x => { arYml.checkFormat() })
        })


        it('should throw error when invalid field exists in root', function() {
            const arYml = new AutoreleaseYml(this.path)
            arYml.__data.xxxx = {}

            assert.throws(x => { arYml.checkFormat() }, /Unknown field: "xxxx"/)
        })


        context('about hooks',function() {

            it('should be ok with empty hooks', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks = {}

                assert.doesNotThrow(x => { arYml.checkFormat() })
            })


            it('should throw error when invalid field exists in hooks.', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.ghpages = {}

                assert.throws(x => { arYml.checkFormat() }, /Unknown field: "hooks.ghpages"/)
            })

            it('should be ok when hooks.update_modules contains only "pre" field', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules = {pre: ['echo AutoRelease!']}

                assert.doesNotThrow(x => { arYml.checkFormat() })
            })


            it('should throw error when hooks.update_modules is empty', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules = {}

                assert.throws(x => { arYml.checkFormat() }, /Field not found: "hooks\.update_modules\.pre"/)
            })


            it('should throw error when invalid field exists in hooks.update_modules', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules.before = {}

                assert.throws(x => { arYml.checkFormat() }, /Unknown field: "hooks.update_modules.before"/)
            })


            it('should be ok when hooks.update_modules is array', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules.pre = ['echo "CureApp"', 'rm .gitignore']
                assert.doesNotThrow(x => { arYml.checkFormat() })
            })


            it('should be ok when hooks.update_modules is string', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules.pre = 'echo "CureApp"'
                assert.doesNotThrow(x => { arYml.checkFormat() })
            })

            it('should throw error when hooks.update_modules is object', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.hooks.update_modules.pre = { cmd1: 'echo "CureApp"' }
                assert.throws(x => { arYml.checkFormat() }, /It should be an array or a string/)
            })

        })

        context('about config',function() {

            it('should be ok with empty config', function() {

                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.config = {}

                assert.doesNotThrow(x => { arYml.checkFormat() })
            })

            it('should throw error when invalid field exists in config', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.config = { isCucumber: true }

                assert.throws(x => { arYml.checkFormat() }, /Unknown field: "config.isCucumber"/)
            })

            it('should throw error when config.git_user_email is an object', function() {
                const arYml = new AutoreleaseYml(this.path)
                arYml.__data.config = { git_user_email: {domain: 'gmail.com', account: 'shinout310'} }

                assert.throws(x => { arYml.checkFormat() }, /It should not be an object/)
            })

        })

    })
})
