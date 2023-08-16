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

var _path;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgBagFill = function SvgBagFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16.492 6.228C16.26 3.914 14.517 2 12 2S7.74 3.914 7.508 6.228h-.862a2.949 2.949 0 0 0-2.942 2.753l-.697 10.181a2.949 2.949 0 0 0 2.942 3.145H18.05a2.948 2.948 0 0 0 2.942-3.145l-.697-10.181a2.948 2.948 0 0 0-2.942-2.753h-.862Zm-7.068 0C9.634 4.85 10.667 3.902 12 3.902s2.366.948 2.576 2.326H9.424Zm-1.916 0h1.916c-.026.17-.04.346-.04.528v3.09a.951.951 0 1 1-1.902 0v-3.09c0-.178.009-.354.026-.528Zm8.984 0h-1.916c.026.17.04.346.04.528v3.09a.951.951 0 0 0 1.902 0v-3.09c0-.178-.009-.354-.026-.528Z"
  })));
};

exports.ReactComponent = SvgBagFill;
