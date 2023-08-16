'use strict';

var React = require('react');

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

var _path, _path2;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgLinePointFill = function SvgLinePointFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M13.087 9.928c-.242-.19-.572-.286-.99-.286h-.792v2.486h.792c.418 0 .748-.095.99-.286.242-.19.363-.517.363-.979 0-.44-.121-.752-.363-.935Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11ZM9.457 7.926c-.118 0-.176.059-.176.176v7.722c0 .117.058.176.176.176h1.672c.117 0 .176-.059.176-.176v-1.98h.847c1.114 0 1.958-.25 2.53-.748.572-.506.858-1.243.858-2.211 0-.975-.286-1.712-.858-2.211-.572-.499-1.416-.748-2.53-.748H9.457Z"
  })));
};

exports.ReactComponent = SvgLinePointFill;
