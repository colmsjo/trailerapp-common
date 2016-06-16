/* globals $ _ gizur */
/* eslint consistent-this: ["error", "self"] */
/* eslint no-warning-comments: 0 */
/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/* eslint no-div-regex: 0 */

// Exports
// =======

jQuery.sap.declare("gizur.trailerapp-common.util.Util");

// Imports
// =======

// TODO: Should rather set the config by calling a function or using a constructors
jQuery.sap.require("gizur.trailerapp-common.Config");

// The Util class
// ================

gizur.trailerapp-common.util.Util = {

    // This makes it possible to control the logging level for our classes
    // separately (avoiding all the OpenUI5 stuff)
    log: console.log.bind(console),
    debug: console.log.bind(console, 'DEBUG'),
    error: console.log.bind(console, 'ERROR'),

    xhr: function (oDataEntity, method, columns, filter, orderBy) {
        "use strict";

        var self = this;

        var path = gizur.trailerapp.Config.appConfig.serverPath;

        // Simple solution for returning mock data instead of performing ajax call
        if (gizur.trailerapp.Config.appConfig.useMockData) {
            if (['POST','PUT','DELETE'].indexOf(method) != -1) {
                return Promise.resolve({"msg": "update/insert/delete using mock data has no effect!"});
            }

            var filterName = "";
            if (filter) {
                filterName = filter.split("'")[1];
            }

            path = jQuery.sap.getModulePath('') + '/../localService/mockdata/' +
            oDataEntity + '.' + filterName + '.json';

            var p = new Promise(function(resolve, reject) {
                $.getJSON(path, function (jsonArray) {
                    var res = JSON.parse(JSON.stringify(jsonArray), self.dateParser);
                    resolve(res);
                })
                .fail(console.log.bind(console, 'ERROR'));
            });

            return p;
        } else {
            var options = gizur.trailerapp.Config.appConfig.oDApiOptions;
            var od = new Odata(options);

            return this._oDApiGet(od, options.accountId, oDataEntity, columns, filter, orderBy, 0, []);
        }
    },

    oDApiExecuteProcedure: function(procedure, params) {
        var options = gizur.trailerapp.Config.appConfig.oDApiOptions;
        var od = new Odata(options);

        return od.executeProcedure(options.accountId, procedure, params);
    },

    generateUUID: function(){
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },

    dataURItoBlob: function(dataURI) { // TODO temp
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString = atob(dataURI);

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:"image/jpeg"});
    },

    // Recursively get entries via ODAPI until there is no more entries to return
    _oDApiGet: function(od, accountId, oDataEntity, columns, filter, orderBy, skip, previous) {
        var self = this;

        return od.get(accountId, oDataEntity, columns, filter, orderBy, skip).then(
            function(result) {
                var data = result.data;
                if (data.length > 1) {
                    data.shift(); // remove the first element which is the statuscode
                    previous = previous.concat(data);

                    skip += data.length;

                    return self._oDApiGet(od, accountId, oDataEntity, columns, filter, orderBy, skip, previous);
                } else {
                    return previous;
                }
            }
        );
    },

    // Convert string in ISO 8601 to proper Date objectsUse this reviver with
    // JSON.parse(json, this.dateParser);
    dateParser: function (key, value) {
        "use strict";

        if ((key.toLowerCase().indexOf('time') > -1 ||
        key.toLowerCase().indexOf('date') > -1 )
        && typeof value === 'string') {
            var d = new Date(value);
            if (d instanceof Date && isFinite(d)) {
                return d;
            }
        }
        return value;
    }
};

//
// Polyfill for Array.find since it isn't available in IE
//===================================================
//
// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
// TODO: move to separate file?

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        'use strict';

        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

//
// Polyfill for Array.filter since it isn't available in IE
//===================================================
//
// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// TODO: move to separate file?

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === undefined || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : undefined;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
