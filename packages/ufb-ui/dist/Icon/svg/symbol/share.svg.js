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
var SvgShare = function SvgShare(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.9 12.5a3.6 3.6 0 0 1 6.007-2.677l6.077-3.546a3.6 3.6 0 1 1 1.11 1.9l-6.078 3.546a3.614 3.614 0 0 1 .042 1.326l5.868 2.934a3.6 3.6 0 1 1-.984 1.968l-5.868-2.934A3.6 3.6 0 0 1 1.9 12.5Zm14.2-7a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm-12 7a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm13.4 4.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
  })));
};

exports.ReactComponent = SvgShare;
