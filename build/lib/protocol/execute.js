'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var execute = function execute() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var script = args.shift();

    /*!
     * parameter check
     */
    if (typeof script !== 'string' && typeof script !== 'function') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with execute protocol command');
    }

    /*!
     * instances started as multibrowserinstance can't getting called with
     * a function paramter, therefor we need to check if it starts with "function () {"
     */
    if (typeof script === 'function' || this.inMultibrowserMode && script.indexOf('function (') === 0) {
        script = 'return (' + script + ').apply(null, arguments)';
    }

    // ToDo change this according to new Webdriver specs to:
    // /session/{session id}/execute/sync
    return this.requestHandler.create('/session/:sessionId/execute', { script: script, args: args });
}; /**
    *
    * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
    * The executed script is assumed to be synchronous and the result of evaluating the script is returned to
    * the client.
    *
    * The script argument defines the script to execute in the form of a function body. The value returned by
    * that function will be returned to the client. The function will be invoked with the provided args array
    * and the values may be accessed via the arguments object in the order specified.
    *
    * Arguments may be any JSON-primitive, array, or JSON object. JSON objects that define a WebElement
    * reference will be converted to the corresponding DOM element. Likewise, any WebElements in the script
    * result will be returned to the client as WebElement JSON objects.
    *
    * <example>
       :execute.js
       it('should inject javascript on the page', function () {
           var result = browser.execute(function(a, b, c, d) {
               // browser context - you may not access client or console
               return a + b + c + d;
           }, 1, 2, 3, 4)
   
           // node.js context - client and console are available
           console.log(result.value); // outputs: 10
       });
    * </example>
    *
    * @param {String|Function} script                     The script to execute.
    * @param {*}               [argument1,...,argumentN]  script arguments
    *
    * @returns {*}             The script result.
    *
    * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-execute-script
    * @type protocol
    *
    */

exports.default = execute;
module.exports = exports['default'];
