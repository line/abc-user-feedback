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
var SvgLockFill = function SvgLockFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.5 10.1a2.85 2.85 0 0 1 2.85-2.85h1.029a5.702 5.702 0 0 1 11.242 0h1.029a2.85 2.85 0 0 1 2.85 2.85v8.55a2.85 2.85 0 0 1-2.85 2.85H5.35a2.85 2.85 0 0 1-2.85-2.85V10.1Zm13.181-2.85a3.802 3.802 0 0 0-7.36 0h7.36Zm-4.868 5.7a1.187 1.187 0 1 0 2.374 0 1.187 1.187 0 0 0-2.374 0Zm0 3.324a1.187 1.187 0 1 0 2.374 0 1.187 1.187 0 0 0-2.374 0Z"
  })));
};

exports.ReactComponent = SvgLockFill;
