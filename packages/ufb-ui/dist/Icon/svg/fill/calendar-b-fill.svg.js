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
var SvgCalendarBFill = function SvgCalendarBFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M2.5 5.35A2.85 2.85 0 0 1 5.35 2.5h13.3a2.85 2.85 0 0 1 2.85 2.85v1.425h-19V5.35Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.5 18.65a2.85 2.85 0 0 1-2.85 2.85H5.35a2.85 2.85 0 0 1-2.85-2.85V8.675h19v9.975Zm-5.376-4.663a1.187 1.187 0 1 0 2.375 0 1.187 1.187 0 0 0-2.375 0Zm-2.138 4.512a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Zm3.325 0a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Zm-3.325-3.325a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Z"
  })));
};

exports.ReactComponent = SvgCalendarBFill;
