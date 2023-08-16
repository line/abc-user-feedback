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
var SvgSunStroke = function SvgSunStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#sun-stroke_svg__a)",
    fillRule: "evenodd",
    clipRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12 8.1a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8ZM5.9 12a6.1 6.1 0 1 1 12.2 0 6.1 6.1 0 0 1-12.2 0ZM12 4.1A1.1 1.1 0 0 1 10.9 3V2a1.1 1.1 0 0 1 2.2 0v1A1.1 1.1 0 0 1 12 4.1ZM12 23.1a1.1 1.1 0 0 1-1.1-1.1v-1a1.1 1.1 0 0 1 2.2 0v1a1.1 1.1 0 0 1-1.1 1.1ZM17.586 6.414a1.1 1.1 0 0 1 0-1.556l.707-.707a1.1 1.1 0 0 1 1.556 1.556l-.707.707a1.1 1.1 0 0 1-1.556 0ZM4.151 19.849a1.1 1.1 0 0 1 0-1.556l.707-.707a1.1 1.1 0 0 1 1.556 1.556l-.707.707a1.1 1.1 0 0 1-1.556 0ZM17.586 17.586a1.1 1.1 0 0 1 1.556 0l.707.707a1.1 1.1 0 1 1-1.556 1.556l-.707-.707a1.1 1.1 0 0 1 0-1.556ZM4.151 4.151a1.1 1.1 0 0 1 1.556 0l.707.707a1.1 1.1 0 1 1-1.556 1.556l-.707-.707a1.1 1.1 0 0 1 0-1.556ZM19.9 12a1.1 1.1 0 0 1 1.1-1.1h1a1.1 1.1 0 0 1 0 2.2h-1a1.1 1.1 0 0 1-1.1-1.1ZM.9 12A1.1 1.1 0 0 1 2 10.9h1a1.1 1.1 0 0 1 0 2.2H2A1.1 1.1 0 0 1 .9 12Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "sun-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgSunStroke;
