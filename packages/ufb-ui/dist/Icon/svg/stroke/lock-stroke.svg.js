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
var SvgLockStroke = function SvgLockStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10.75 13a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM12 17.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5 6.9A3.1 3.1 0 0 0 1.9 10v9A3.1 3.1 0 0 0 5 22.1h14a3.1 3.1 0 0 0 3.1-3.1v-9A3.1 3.1 0 0 0 19 6.9h-1.1a6.002 6.002 0 0 0-11.8 0H5Zm0 13a.9.9 0 0 1-.9-.9v-9a.9.9 0 0 1 .9-.9h14a.9.9 0 0 1 .9.9v9a.9.9 0 0 1-.9.9H5Zm3.153-13a4.002 4.002 0 0 1 7.694 0H8.152Z"
  })));
};

exports.ReactComponent = SvgLockStroke;
