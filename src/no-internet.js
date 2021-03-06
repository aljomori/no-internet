/*
 Copyright (c) 2017 Vasyl Stokolosa https://github.com/shystruk
 License: MIT - https://opensource.org/licenses/MIT
 https://github.com/shystruk/no-internet
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        module.exports = factory(require('set-interval')) :
        typeof define === 'function' && define.amd ?
            define(['set-interval'], factory) :
            (global.myBundle = factory(global.SetInterval));
}(this, (function (SetInterval) {
    'use strict';

    SetInterval = SetInterval && SetInterval.hasOwnProperty('default') ? SetInterval['default'] : SetInterval;

    var OFFLINE = true;
    var ONLINE = false;
    var defaultOptions = {
        milliseconds: 5000,
        url: '/favicon.ico'
    };

    /**
     * @param {Object} options
     * @return {Promise|*}
     */
    function noInternet(options) {
        options = options || {};
        options.milliseconds = options.milliseconds || defaultOptions.milliseconds;
        options.url = options.url || defaultOptions.url;

        if (!(!!options.callback)) {
            return new Promise(function (resolve) {
                _checkConnection(options.url, resolve);
            });
        }

        _initEventListeners(options.callback);

        SetInterval.start(_checkConnection.bind(null, options.url, options.callback), options.milliseconds);
    }

    noInternet.clearInterval = function () {
        SetInterval.clear();
    };

    /**
     * @param {String} url
     * @param {Function} callback
     * @private
     */
    function _checkConnection(url, callback) {
        url = _buildURL(url);

        if (navigator.onLine) {
            _sendRequest(url, callback);
        } else {
            callback(OFFLINE);
        }
    }

    /**
     * @param {Function} callback
     * @private
     */
    function _initEventListeners(callback) {
        window.addEventListener('online', function () {
            callback(ONLINE);
        });

        window.addEventListener('offline', function () {
            callback(OFFLINE);
        });
    }

    /**
     * @param {String} url
     * @param {Function} callback
     * @private
     */
    function _sendRequest(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            callback(ONLINE);
        };

        xhr.onerror = function () {
            callback(OFFLINE);
        };

        xhr.open('GET', url);
        xhr.send();
    }

    /**
     * @param {String} url
     * @return {String}
     * @private
     */
    function _buildURL(url) {
        if (url.indexOf('http') !== -1) {
            return url;
        }

        return window.location.protocol + '//' + window.location.host + url;
    }

    return noInternet;
})));
