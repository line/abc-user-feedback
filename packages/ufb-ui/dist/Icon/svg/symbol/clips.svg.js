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
var SvgClips = function SvgClips(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M3.506 5.26a4.6 4.6 0 0 0 0 6.506l2.207 2.207a1.1 1.1 0 1 0 1.556-1.556L5.062 10.21a2.4 2.4 0 0 1 0-3.394l1.754-1.754a2.4 2.4 0 0 1 3.394 0l2.207 2.207a1.1 1.1 0 0 0 1.556-1.556l-2.207-2.207a4.6 4.6 0 0 0-6.505 0L3.506 5.261ZM11.511 16.66a1.1 1.1 0 1 0-1.555 1.556l2.035 2.035a4.6 4.6 0 0 0 6.506 0l1.754-1.755a4.6 4.6 0 0 0 0-6.505l-2.035-2.035a1.1 1.1 0 1 0-1.556 1.555l2.036 2.036a2.4 2.4 0 0 1 0 3.394l-1.755 1.755a2.4 2.4 0 0 1-3.394 0L11.51 16.66Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M11.414 9.686a1.1 1.1 0 1 0-1.556 1.556l2.829 2.828a1.1 1.1 0 0 0 1.555-1.555l-2.828-2.829Z"
  })));
};

exports.ReactComponent = SvgClips;
