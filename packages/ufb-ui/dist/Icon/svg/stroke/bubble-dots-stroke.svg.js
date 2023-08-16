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

var _path, _path2;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgBubbleDotsStroke = function SvgBubbleDotsStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M9.25 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13.25 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM17.256 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M.9 7.25A5.1 5.1 0 0 1 6 2.15h12a5.1 5.1 0 0 1 5.1 5.1v7.5a5.1 5.1 0 0 1-5.1 5.1h-.17l-.772 2.702a1.1 1.1 0 0 1-1.783.526l-3.688-3.228H6a5.1 5.1 0 0 1-5.1-5.1v-7.5ZM6 4.35a2.9 2.9 0 0 0-2.9 2.9v7.5a2.9 2.9 0 0 0 2.9 2.9h6a1.1 1.1 0 0 1 .724.272l2.695 2.358.523-1.832A1.1 1.1 0 0 1 17 17.65h1a2.9 2.9 0 0 0 2.9-2.9v-7.5a2.9 2.9 0 0 0-2.9-2.9H6Z"
  })));
};

exports.ReactComponent = SvgBubbleDotsStroke;
