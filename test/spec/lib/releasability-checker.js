import ReleasabilityChecker from '../../../src/lib/releasability-checker'
import assert from 'power-assert'


describe('ReleasabilityChecker', function() {

    describe('check',function() {

        it('should return notice message of no release when commit message is incompatible', function() {
            const cwd = __dirname
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'fix typo' } }
            assert(checker.check(cwd).match(/No release process/))
        })


        it('should return undefined when commit message is compatible and no .bmp.yml is found', function() {
            const cwd = __dirname
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 1.2.3' } }
            assert(checker.check(cwd) === undefined)
        })


        it('should return undefined when commit message is compatible and equals to the version in .bmp.yml', function() {
            const cwd = __dirname + '/../data'
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 1.2.3' } }
            assert(checker.check(cwd) === undefined)
        })


        it('should return notice message of mismatch when commit message is compatible but not equals to the version in .bmp.yml', function() {
            const cwd = __dirname + '/../data'
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 2.0.1' } }
            assert(checker.check(cwd).match(/not consistent with/) )
        })


    })

    describe('getVersionFromLog',function() {

        it('should return 1.2.3 when commit log is "release 1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 1.2.3' } }
            assert(checker.getVersionFromLog() === '1.2.3')
        })

        it('should return 13.0.3b when commit log is "re-release 13.0.3b"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 're-release 13.0.3b' } }
            assert(checker.getVersionFromLog() === '13.0.3b')
        })


        it('should return null when commit log is "release v1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release v1.2.3' } }
            assert(checker.getVersionFromLog() === null)
        })


        it('should return null when commit log is "re-release v1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 're-release v1.2.3' } }
            assert(checker.getVersionFromLog() === null)
        })

    })

    describe('getVersionFromBmp',function() {

        it('should load version from .bmp.yml', function() {
            const cwd = __dirname + '/../data'
            const checker = new ReleasabilityChecker()
            assert(checker.getVersionFromBmp(cwd) === '1.2.3')
        })

        it('should return null when .bmp.yml is not exist', function() {
            const cwd = __dirname
            const checker = new ReleasabilityChecker()
            assert(checker.getVersionFromBmp(cwd) === null)
        })

    })

})
