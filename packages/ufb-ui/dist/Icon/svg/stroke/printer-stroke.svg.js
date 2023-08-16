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
var SvgPrinterStroke = function SvgPrinterStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#printer-stroke_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M19 9.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M.9 15A3.1 3.1 0 0 0 4 18.1h.9V22A1.1 1.1 0 0 0 6 23.1h12a1.1 1.1 0 0 0 1.1-1.1v-3.9h.9a3.1 3.1 0 0 0 3.1-3.1V8A3.1 3.1 0 0 0 20 4.9h-.9V2A1.1 1.1 0 0 0 18 .9H6A1.1 1.1 0 0 0 4.9 2v2.9H4A3.1 3.1 0 0 0 .9 8v7Zm2.2-7a.9.9 0 0 1 .9-.9h16a.9.9 0 0 1 .9.9v7a.9.9 0 0 1-.9.9h-.9V13a1.1 1.1 0 0 0-1.1-1.1H6A1.1 1.1 0 0 0 4.9 13v2.9H4a.9.9 0 0 1-.9-.9V8Zm4-3.1V3.1h9.8v1.8H7.1Zm0 16v-6.8h9.8v6.8H7.1Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "printer-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgPrinterStroke;
