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

var _path, _path2, _path3, _defs;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgLoadingDark = function SvgLoadingDark(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 22.5A10.5 10.5 0 0 0 22.5 12H24a12 12 0 0 1-24 0h1.5A10.5 10.5 0 0 0 12 22.5Z",
    fill: "url(#loading-dark_svg__a)"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M22.5 12a10.5 10.5 0 1 0-21 0H0a12 12 0 1 1 24 0h-1.5Z",
    fill: "url(#loading-dark_svg__b)"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M23.242 12.984a.75.75 0 0 1-.743-.757v-.22a.75.75 0 0 1 1.5-.015v.25a.75.75 0 0 1-.757.742Z",
    fill: "#fff"
  })), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("linearGradient", {
    id: "loading-dark_svg__a",
    x1: 23.249,
    y1: 23.25,
    x2: 0.75,
    y2: 23.25,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React__namespace.createElement("stop", {
    stopColor: "#fff",
    stopOpacity: 0
  }), /*#__PURE__*/React__namespace.createElement("stop", {
    offset: 1,
    stopColor: "#fff",
    stopOpacity: 0.5
  })), /*#__PURE__*/React__namespace.createElement("linearGradient", {
    id: "loading-dark_svg__b",
    x1: 23.249,
    y1: 12,
    x2: 0.75,
    y2: 12,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React__namespace.createElement("stop", {
    stopColor: "#fff"
  }), /*#__PURE__*/React__namespace.createElement("stop", {
    offset: 1,
    stopColor: "#fff",
    stopOpacity: 0.5
  })))));
};

exports.ReactComponent = SvgLoadingDark;
