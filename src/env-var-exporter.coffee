
yaml = require 'js-yaml'
fs = require 'fs'
PackageJSONLoader = require './package-json-loader'
WorkingDirectory = require './working-directory'

###*
get shell commands to export environment variables defined in circle.yml

@class EnvVarExporter
###
class EnvVarExporter

    ###*
    get shell commands to export environment variables defined in CircleCI

    @method getCircleEnvVars
    @static
    ###
    @getCircleEnvVars: ->

        cwd = process.cwd()

        packageJSON = PackageJSONLoader.load(cwd)

        @loadCircleCIEnvVars(packageJSON).join('')



    ###*
    get shell commands to export environment variables defined in circle.yml

    @method getCustomEnvVars
    @static
    ###
    @getCustomEnvVars: ->

        cwd = process.cwd()

        filename = cwd + '/circle.yml'
        if not fs.existsSync(filename)
            throw new Error('circle.yml is required.')

        yml = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))

        envs = yml.machine?.environment
        if not envs
            throw new Error('circle.yml must contain machine.environment .')

        ("export #{envName}=\"#{value}\";\n" for envName, value of envs).join('')


    @loadCircleCIEnvVars: (packageJSON)->
        url = packageJSON.repository?.url
        [_..., username, reponame ] = url?.split('/') ? []
        reponame = reponame.slice(0, -4) if reponame?.match(/\.git$/)

        envVars =
            CIRCLECI: true
            CI: true
            CIRCLE_PROJECT_USERNAME: username ? ''
            CIRCLE_PROJECT_REPONAME: reponame ? ''
            CIRCLE_BRANCH: 'master'
            CIRCLE_TAG: ''
            CIRCLE_SHA1: ''
            CIRCLE_REPOSITORY_URL: url ? ''
            CIRCLE_COMPARE_URL: ''
            CIRCLE_BUILD_NUM: 0
            CIRCLE_PREVIOUS_BUILD_NUM: 0
            CI_PULL_REQUESTS: ''
            CI_PULL_REQUEST: ''
            CIRCLE_ARTIFACTS: ''
            CIRCLE_USERNAME: ''
            CIRCLE_TEST_REPORTS: ''
            CIRCLE_PR_USERNAME: ''
            CIRCLE_PR_REPONAME: ''
            CIRCLE_PR_NUMBER: 1
            CIRCLE_NODE_TOTAL: 1
            CIRCLE_NODE_INDEX: 1
            CIRCLE_BUILD_IMAGE: ''

        for envName, value of envVars
            "export #{envName}=\"#{value}\";\n"


module.exports = EnvVarExporter
