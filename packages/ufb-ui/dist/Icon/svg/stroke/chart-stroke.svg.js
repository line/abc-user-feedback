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
var SvgChartStroke = function SvgChartStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M3.125 2.5v9.583c0 .92.746 1.667 1.667 1.667h2.083M3.125 2.5h-1.25m1.25 0h13.75m0 0h1.25m-1.25 0v9.583c0 .92-.746 1.667-1.667 1.667h-2.083m-6.25 0h6.25m-6.25 0-.833 2.5m7.083-2.5.833 2.5m0 0 .417 1.25m-.417-1.25H6.042m0 0-.417 1.25M7.5 9.375v1.25M10 7.5v3.125m2.5-5v5",
    stroke: "currentColor",
    strokeWidth: 1.833,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};

exports.ReactComponent = SvgChartStroke;
