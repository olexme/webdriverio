'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Receive the current activity on an Android device.
 *
 * <example>
    :rotateAsync.js
    it('should get the activity of the android device', function () {
        var activity = browser.currentActivity()
        console.log(activity); // returns android activity information
    });
 * </example>
 *
 * @see https://github.com/appium/appium-android-driver/blob/master/lib/commands/general.js#L59-L61
 * @type mobile
 * @for android
 *
 */

var currentActivity = function currentActivity() {
    return this.requestHandler.create('/session/:sessionId/appium/device/current_activity');
};

exports.default = currentActivity;
module.exports = exports['default'];
