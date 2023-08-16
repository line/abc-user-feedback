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
var SvgNewCircleStroke = function SvgNewCircleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#new-circle-stroke_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M9.104 16.5c.691 0 1.104-.393 1.104-1.101V11.24h.05l3.528 4.643c.336.442.647.617 1.116.617.705 0 1.098-.37 1.098-1.041V8.602c0-.709-.406-1.102-1.104-1.102-.692 0-1.104.393-1.104 1.102v4.11h-.05l-3.503-4.595C9.89 7.682 9.573 7.5 9.13 7.5 8.406 7.5 8 7.87 8 8.553v6.845c0 .709.407 1.102 1.105 1.102Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "new-circle-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgNewCircleStroke;
