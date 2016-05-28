import ReleasabilityChecker from '../../../src/lib/releasability-checker'
import assert from 'power-assert'


describe('ReleasabilityChecker', function() {

    describe('warnMessage', function() {

        it('should return notice message of no release when commit message is incompatible', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'fix typo' } }
            assert(checker.warnMessage.match(/No release process/))
        })
    })

    describe('logVersion',function() {

        it('should return 1.2.3 when commit log is "release 1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 1.2.3' } }
            assert(checker.logVersion === '1.2.3')
        })

        it('should return 13.0.3b when commit log is "re-release 13.0.3b"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 're-release 13.0.3b' } }
            assert(checker.logVersion === '13.0.3b')
        })


        it('should return null when commit log is "release v1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release v1.2.3' } }
            assert(checker.logVersion === null)
        })


        it('should return null when commit log is "re-release v1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 're-release v1.2.3' } }
            assert(checker.logVersion === null)
        })

    })

    describe('isReleasable',function() {

        it('should return true when commit log is "release 1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 'release 1.2.3' } }
            assert(checker.isReleasable === true)
        })

        it('should return false when commit log is "re-release v1.2.3"', function() {
            const checker = new ReleasabilityChecker()
            checker.exec = ()=> { return { stdout: 're-release v1.2.3' } }
            assert(checker.isReleasable === false)
        })


    })
})
