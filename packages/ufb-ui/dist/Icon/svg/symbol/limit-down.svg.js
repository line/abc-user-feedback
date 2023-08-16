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
var SvgLimitDown = function SvgLimitDown(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.222 11.222a1.1 1.1 0 0 1 1.556 0l3.122 3.122V3a1.1 1.1 0 0 1 2.2 0v11.344l3.122-3.122a1.1 1.1 0 1 1 1.556 1.556l-5 5a1.1 1.1 0 0 1-1.556 0l-5-5a1.1 1.1 0 0 1 0-1.556ZM18.1 21a1.1 1.1 0 0 1-1.1 1.1H7a1.1 1.1 0 0 1 0-2.2h10a1.1 1.1 0 0 1 1.1 1.1Z"
  })));
};

exports.ReactComponent = SvgLimitDown;
