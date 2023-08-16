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
var SvgWarningCircleFill = function SvgWarningCircleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-10 1.87c.69 0 1.046-.411 1.066-1.115l.123-4.252c.007-.11.014-.232.014-.321 0-.76-.444-1.203-1.196-1.203-.759 0-1.21.444-1.21 1.203l.003.144c.002.058.004.12.004.177l.13 4.252c.02.704.369 1.114 1.066 1.114Zm0 3.356c.71 0 1.292-.54 1.292-1.23 0-.684-.581-1.225-1.292-1.225-.718 0-1.299.54-1.299 1.224 0 .69.581 1.23 1.299 1.23Z"
  })));
};

exports.ReactComponent = SvgWarningCircleFill;
