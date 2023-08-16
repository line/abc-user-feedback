'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var index = require('./svg/index.js');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

const IconNames = Object.keys(index);
const Icon = _a => {
  var {
      name,
      size = 24,
      className
    } = _a,
    props = tslib_es6.__rest(_a, ["name", "size", "className"]);
  return React__namespace.createElement(index[name], Object.assign({
    width: size,
    height: size,
    className: `inline-block ${className}`
  }, props));
};

exports.Icon = Icon;
exports.IconNames = IconNames;
