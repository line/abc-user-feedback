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

var _g, _defs;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgCallCircleStroke = function SvgCallCircleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#call-circle-stroke_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "m10.196 11.26.804-.804c.48-.48.515-1.269.086-1.887l-.538-.827c-.57-.82-1.694-.992-2.329-.357l-.695.695c-.687.688-.626 1.815-.232 2.889.406 1.104 1.216 2.324 2.315 3.424 1.1 1.1 2.32 1.909 3.424 2.314 1.074.395 2.201.456 2.889-.231l.695-.695c.635-.635.463-1.76-.357-2.33l-.829-.539c-.618-.43-1.408-.393-1.887.086l-.804.804a2.448 2.448 0 0 1-.034-.018c-.23-.125-.638-.403-1.361-1.127-.724-.723-1.004-1.132-1.13-1.363a2.454 2.454 0 0 1-.017-.034Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "call-circle-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgCallCircleStroke;
