'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleMouseButtonCommand = require('../helpers/handleMouseButtonCommand');

var _handleMouseButtonCommand2 = _interopRequireDefault(_handleMouseButtonCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rightClick = function rightClick(selector, xoffset, yoffset) {
  return _handleMouseButtonCommand2.default.call(this, selector, 'right', xoffset, yoffset);
}; /**
    *
    * Apply right click on an element. If selector is not provided, click on the last
    * moved-to location.
    *
    * @alias browser.rightClick
    * @param {String} selector element to click on
    * @param {Number} xoffset  X offset to move to, relative to the top-left corner of the element.
    * @param {Number} yoffset  Y offset to move to, relative to the top-left corner of the element.
    * @uses protocol/element, protocol/buttonPress
    * @type action
    *
    */

exports.default = rightClick;
module.exports = exports['default'];
