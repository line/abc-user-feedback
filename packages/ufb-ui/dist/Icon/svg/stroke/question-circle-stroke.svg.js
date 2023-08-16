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
var SvgQuestionCircleStroke = function SvgQuestionCircleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#question-circle-stroke_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.533 13.404c-.102.458-.369.725-.854.725-.581 0-.923-.397-.923-.957v-.096c0-.806.417-1.34 1.223-1.811.882-.527 1.149-.869 1.149-1.497 0-.67-.52-1.135-1.272-1.135-.67 0-1.12.328-1.34.936-.17.438-.478.63-.895.63-.54 0-.875-.336-.875-.855 0-.294.068-.554.205-.814.438-.902 1.531-1.483 3.001-1.483 1.941 0 3.247 1.066 3.247 2.66 0 1.031-.499 1.735-1.463 2.303-.909.526-1.114.82-1.203 1.394ZM12.813 16.098c0 .601-.499 1.073-1.12 1.073-.616 0-1.115-.472-1.115-1.073 0-.602.5-1.074 1.114-1.074.622 0 1.121.472 1.121 1.074Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M23.1 12C23.1 5.87 18.13.9 12 .9S.9 5.87.9 12 5.87 23.1 12 23.1 23.1 18.13 23.1 12ZM12 20.9a8.9 8.9 0 1 1 0-17.8 8.9 8.9 0 0 1 0 17.8Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "question-circle-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgQuestionCircleStroke;
