'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Change focus to the parent context. If the current context is the top level browsing context,
 * the context remains unchanged.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#switch-to-parent-frame
 * @type protocol
 *
 */

var frameParent = function frameParent() {
    return this.requestHandler.create({
        path: '/session/:sessionId/frame/parent',
        method: 'POST'
    });
};

exports.default = frameParent;
module.exports = exports['default'];
