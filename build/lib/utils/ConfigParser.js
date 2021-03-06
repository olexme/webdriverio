'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _detectSeleniumBackend = require('../helpers/detectSeleniumBackend');

var _detectSeleniumBackend2 = _interopRequireDefault(_detectSeleniumBackend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOOKS = ['before', 'beforeSession', 'beforeSuite', 'beforeHook', 'beforeTest', 'beforeCommand', 'afterCommand', 'afterTest', 'afterHook', 'afterSuite', 'afterSession', 'after', 'beforeFeature', 'beforeScenario', 'beforeStep', 'afterFeature', 'afterScenario', 'afterStep', 'onError', 'onReload'];

var DEFAULT_TIMEOUT = 10000;
var NOOP = function NOOP() {};
var DEFAULT_CONFIGS = {
    sync: true,
    specs: [],
    suites: {},
    exclude: [],
    logLevel: 'silent',
    coloredLogs: true,
    baseUrl: null,
    bail: 0,
    waitforInterval: 500,
    waitforTimeout: 1000,
    framework: 'mocha',
    reporters: [],
    reporterOptions: {},
    maxInstances: 100,
    maxInstancesPerCapability: 100,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    debug: false,
    execArgv: null,

    /**
     * framework defaults
     */
    mochaOpts: {
        timeout: DEFAULT_TIMEOUT
    },
    jasmineNodeOpts: {
        defaultTimeoutInterval: DEFAULT_TIMEOUT
    },

    /**
     * hooks
     */
    onPrepare: NOOP,
    before: [],
    beforeSession: [],
    beforeSuite: [],
    beforeHook: [],
    beforeTest: [],
    beforeCommand: [],
    afterCommand: [],
    afterTest: [],
    afterHook: [],
    afterSuite: [],
    afterSession: [],
    after: [],
    onComplete: NOOP,
    onError: [],
    onReload: [],

    /**
     * cucumber specific hooks
     */
    beforeFeature: [],
    beforeScenario: [],
    beforeStep: [],
    afterFeature: [],
    afterScenario: [],
    afterStep: []
};

var ConfigParser = function () {
    function ConfigParser() {
        (0, _classCallCheck3.default)(this, ConfigParser);

        this._config = DEFAULT_CONFIGS;
        this._capabilities = [];
    }

    /**
     * merges config file with default values
     * @param {String} filename path of file relative to current directory
     */


    (0, _createClass3.default)(ConfigParser, [{
        key: 'addConfigFile',
        value: function addConfigFile(filename) {
            if (typeof filename !== 'string') {
                throw new Error('addConfigFile requires filepath');
            }

            var filePath = _path2.default.resolve(process.cwd(), filename);

            try {
                /**
                 * clone the orginal config
                 */
                var fileConfig = (0, _deepmerge2.default)(require(filePath).config, {});

                if ((typeof fileConfig === 'undefined' ? 'undefined' : (0, _typeof3.default)(fileConfig)) !== 'object') {
                    throw new Error('configuration file exports no config object');
                }

                /**
                 * merge capabilities
                 */
                this._capabilities = (0, _deepmerge2.default)(this._capabilities, fileConfig.capabilities || {});
                delete fileConfig.capabilities;

                /**
                 * add service hooks and remove them from config
                 */
                this.addService(fileConfig);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)(HOOKS), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var hookName = _step.value;

                        delete fileConfig[hookName];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this._config = (0, _deepmerge2.default)(this._config, fileConfig);

                /**
                 * detect Selenium backend
                 */
                this._config = (0, _deepmerge2.default)((0, _detectSeleniumBackend2.default)(this._config), this._config);
            } catch (e) {
                console.error('Failed loading configuration file: ' + filePath);
                throw e;
            }
        }

        /**
         * merge external object with config object
         * @param  {Object} object  desired object to merge into the config object
         */

    }, {
        key: 'merge',
        value: function merge() {
            var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._config = (0, _deepmerge2.default)(this._config, object);

            /**
             * run single spec file only
             */
            if (typeof object.spec === 'string') {
                var specs = [];
                var specList = object.spec.split(/,/g);

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)(specList), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var spec = _step2.value;

                        if (_fs2.default.existsSync(spec)) {
                            specs.push(_path2.default.resolve(process.cwd(), spec));
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                if (specs.length === 0) {
                    throw new Error('spec file ' + object.spec + ' not found');
                }

                this._config.specs = specs;
            }

            /**
             * user and key could get added via cli arguments so we need to detect again
             * Note: cli arguments are on the right and overwrite config
             * if host and port are default, remove them to get new values
             */
            var defaultBackend = (0, _detectSeleniumBackend2.default)({});
            if (this._config.host === defaultBackend.host && this._config.port === defaultBackend.port) {
                delete this._config.host;
                delete this._config.port;
            }

            this._config = (0, _deepmerge2.default)((0, _detectSeleniumBackend2.default)(this._config), this._config);
        }

        /**
         * add hooks from services to runner config
         * @param {Object} service  a service is basically an object that contains hook methods
         */

    }, {
        key: 'addService',
        value: function addService(service) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(HOOKS), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var hookName = _step3.value;

                    if (!service[hookName]) {
                        continue;
                    } else if (typeof service[hookName] === 'function') {
                        this._config[hookName].push(service[hookName].bind(service));
                    } else if (Array.isArray(service[hookName])) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = (0, _getIterator3.default)(service[hookName]), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var hook = _step4.value;

                                if (typeof hook === 'function') {
                                    this._config[hookName].push(hook.bind(service));
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
         * get excluded files from config pattern
         */

    }, {
        key: 'getSpecs',
        value: function getSpecs(capSpecs, capExclude) {
            var specs = ConfigParser.getFilePaths(this._config.specs);
            var exclude = ConfigParser.getFilePaths(this._config.exclude);

            /**
             * check if user has specified a specific suites to run
             */
            var suites = typeof this._config.suite === 'string' ? this._config.suite.split(',') : [];
            if (Array.isArray(suites) && suites.length > 0) {
                var suiteSpecs = [];
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = (0, _getIterator3.default)(suites), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var suiteName = _step5.value;

                        // ToDo: log warning if suite was not found
                        var suite = this._config.suites[suiteName];
                        if (suite && Array.isArray(suite)) {
                            suiteSpecs = suiteSpecs.concat(ConfigParser.getFilePaths(suite));
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                if (suiteSpecs.length === 0) {
                    throw new Error('The suite(s) "' + suites.join('", "') + '" you specified don\'t exist ' + 'in your config file or doesn\'t contain any files!');
                }

                specs = suiteSpecs;
            }

            if (Array.isArray(capSpecs)) {
                specs = specs.concat(ConfigParser.getFilePaths(capSpecs));
            }
            if (Array.isArray(capExclude)) {
                exclude = exclude.concat(ConfigParser.getFilePaths(capExclude));
            }

            return specs.filter(function (spec) {
                return exclude.indexOf(spec) < 0;
            });
        }

        /**
         * return configs
         */

    }, {
        key: 'getConfig',
        value: function getConfig() {
            return this._config;
        }

        /**
         * return capabilities
         */

    }, {
        key: 'getCapabilities',
        value: function getCapabilities(i) {
            if (typeof i === 'number' && this._capabilities[i]) {
                return this._capabilities[i];
            }

            return this._capabilities;
        }

        /**
         * returns a flatten list of globed files
         *
         * @param  {String[]} filenames  list of files to glob
         * @return {String[]} list of files
         */

    }], [{
        key: 'getFilePaths',
        value: function getFilePaths(patterns, omitWarnings) {
            var files = [];

            if (typeof patterns === 'string') {
                patterns = [patterns];
            }

            if (!Array.isArray(patterns)) {
                throw new Error('specs or exclude property should be an array of strings');
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = (0, _getIterator3.default)(patterns), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var pattern = _step6.value;

                    var filenames = _glob2.default.sync(pattern);

                    filenames = filenames.filter(function (filename) {
                        return filename.slice(-3) === '.js' || filename.slice(-3) === '.ts' || filename.slice(-8) === '.feature' || filename.slice(-7) === '.coffee';
                    });

                    filenames = filenames.map(function (filename) {
                        return _path2.default.isAbsolute(filename) ? _path2.default.normalize(filename) : _path2.default.resolve(process.cwd(), filename);
                    });

                    if (filenames.length === 0 && !omitWarnings) {
                        console.warn('pattern', pattern, 'did not match any file');
                    }

                    files = (0, _deepmerge2.default)(files, filenames);
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return files;
        }
    }]);
    return ConfigParser;
}();

exports.default = ConfigParser;
module.exports = exports['default'];
