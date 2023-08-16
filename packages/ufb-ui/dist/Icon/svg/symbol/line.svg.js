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
var SvgLine = function SvgLine(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M11.251 13.011c-.125 0-.142-.14-.142-.14V9.701c.017-.141.142-.141.142-.141h.515a.171.171 0 0 1 .13.083l.003.004.003.004 1.429 1.932V9.702c0-.117.142-.141.142-.141h.51c.114 0 .142.141.142.141v3.168c0 .116-.142.141-.142.141h-.51c-.076 0-.117-.059-.117-.059l-1.454-1.963v1.881c0 .122-.141.141-.141.141h-.51ZM9.962 9.56h.531a.137.137 0 0 1 .12.142c-.002 0 .003 3.168.003 3.168a.127.127 0 0 1-.123.141h-.531s-.142-.017-.142-.141V9.702s.02-.141.142-.141ZM7.847 9.702c0-.112-.12-.141-.12-.141h-.532c-.125 0-.142.141-.142.141v3.168c0 .125.142.141.142.141h2.038c.12 0 .141-.141.141-.141v-.532c0-.12-.141-.12-.141-.12H7.847V9.702ZM14.626 9.702c.02-.141.141-.141.141-.141h2.038s.142.027.142.141v.539s-.039.113-.142.113H15.42v.535h1.386s.127.015.142.142v.51s-.022.142-.142.142H15.42v.535h1.386s.126.016.142.142v.51s-.019.141-.142.141h-2.038s-.141-.011-.141-.141V9.702Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M6.3 2A4.3 4.3 0 0 0 2 6.3v11.4A4.3 4.3 0 0 0 6.3 22h11.4a4.3 4.3 0 0 0 4.3-4.3V6.3A4.3 4.3 0 0 0 17.7 2H6.3Zm5.57 3.213c4.412 0 7.383 2.884 7.383 5.923.102 2.924-3.165 5.212-4.526 6.165-.22.154-.392.274-.49.355-.71.477-2.014 1.275-2.315 1.38-.28.104-.639.198-.622-.224.008-.103.034-.252.063-.413.047-.26.1-.554.087-.743 0-.295-.036-.542-.69-.676-3.448-.45-6.104-2.86-6.104-5.85 0-3.49 3.559-5.917 7.214-5.917Z"
  })));
};

exports.ReactComponent = SvgLine;
