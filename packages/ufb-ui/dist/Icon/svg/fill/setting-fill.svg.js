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
var SvgSettingFill = function SvgSettingFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M11.93 1.4A3.1 3.1 0 0 0 8.95 3.653l-.236.832c-.26.119-.612.287-.88.442-.242.14-.499.318-.697.461l-.82-.207A3.1 3.1 0 0 0 2.871 6.64l-.073.126a3.1 3.1 0 0 0 .458 3.703l.593.614c-.029.264-.06.616-.06.917 0 .301.031.653.06.918l-.593.613a3.1 3.1 0 0 0-.458 3.703l.073.126a3.1 3.1 0 0 0 3.443 1.459l.792-.2c.197.155.458.347.713.494.278.162.638.32.9.43l.229.804a3.1 3.1 0 0 0 2.982 2.253h.138a3.1 3.1 0 0 0 2.982-2.253l.233-.818a8.92 8.92 0 0 0 .843-.417c.253-.147.531-.344.741-.5l.817.207a3.1 3.1 0 0 0 3.443-1.459l.073-.126a3.1 3.1 0 0 0-.458-3.703l-.593-.614c.029-.264.06-.616.06-.917 0-.301-.031-.652-.06-.917l.593-.614a3.1 3.1 0 0 0 .458-3.703l-.073-.126a3.1 3.1 0 0 0-3.443-1.459l-.847.214c-.213-.145-.49-.328-.73-.467a13.663 13.663 0 0 0-.816-.427l-.24-.848A3.1 3.1 0 0 0 12.068 1.4h-.138Zm.065 12.605a2.005 2.005 0 1 1 0-4.01 2.005 2.005 0 0 1 0 4.01Z"
  })));
};

exports.ReactComponent = SvgSettingFill;
