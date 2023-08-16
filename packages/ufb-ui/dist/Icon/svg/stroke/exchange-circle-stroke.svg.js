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
var SvgExchangeCircleStroke = function SvgExchangeCircleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#exchange-circle-stroke_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10.1 7.5a1.1 1.1 0 1 0-2.2 0v6.344l-.122-.122a1.1 1.1 0 1 0-1.556 1.556l2 2a1.1 1.1 0 0 0 1.556 0l2-2a1.1 1.1 0 1 0-1.556-1.556l-.122.122V7.5ZM15.778 6.722a1.1 1.1 0 0 0-1.556 0l-2 2a1.1 1.1 0 1 0 1.556 1.556l.122-.122V16.5a1.1 1.1 0 0 0 2.2 0v-6.344l.122.122a1.1 1.1 0 1 0 1.556-1.556l-2-2Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M23.1 12C23.1 5.87 18.13.9 12 .9S.9 5.87.9 12 5.87 23.1 12 23.1 23.1 18.13 23.1 12ZM12 20.9a8.9 8.9 0 1 1 0-17.8 8.9 8.9 0 0 1 0 17.8Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "exchange-circle-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgExchangeCircleStroke;
