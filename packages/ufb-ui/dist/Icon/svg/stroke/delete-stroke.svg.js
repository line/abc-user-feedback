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
var SvgDeleteStroke = function SvgDeleteStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M9.822 8.222a1.1 1.1 0 0 1 1.556 0l2.222 2.222 2.222-2.222a1.1 1.1 0 1 1 1.556 1.556L15.155 12l2.223 2.222a1.1 1.1 0 1 1-1.556 1.556L13.6 13.556l-2.222 2.222a1.1 1.1 0 1 1-1.556-1.556L12.044 12 9.822 9.778a1.1 1.1 0 0 1 0-1.556Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.98 4.357A3.1 3.1 0 0 1 7.608 2.9H20A3.1 3.1 0 0 1 23.1 6v12a3.1 3.1 0 0 1-3.1 3.1H7.608a3.1 3.1 0 0 1-2.628-1.457l-3.75-6a3.1 3.1 0 0 1 0-3.286l3.75-6Zm2.628.743a.9.9 0 0 0-.763.423l-3.75 6a.9.9 0 0 0 0 .954l3.75 6a.9.9 0 0 0 .763.423H20a.9.9 0 0 0 .9-.9V6a.9.9 0 0 0-.9-.9H7.608Z"
  })));
};

exports.ReactComponent = SvgDeleteStroke;
