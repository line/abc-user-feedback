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
var SvgCarStorke = function SvgCarStorke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.016 4.245.488 8.069.4 8.47V16c0 .76.405 1.427 1.01 1.796a4.1 4.1 0 0 0 8.146.304h3.888a4.1 4.1 0 0 0 8.154-.465l1.693-1.753a1.1 1.1 0 0 0 .309-.764v-2.973a3.1 3.1 0 0 0-1.767-2.799l-3.56-1.696-2.029-3.38a3.85 3.85 0 0 0-3.301-1.87H4.74c-1.2 0-2.279.73-2.724 1.845ZM3.124 7.4l.935-2.339a.733.733 0 0 1 .68-.461H7.4v2.8H3.124Zm14.127 2.2 3.636 1.732a.9.9 0 0 1 .513.813v2.528l-.507.525a4.101 4.101 0 0 0-7.17.702H9.277A4.101 4.101 0 0 0 2.6 14.602V9.6H17.25Zm-2.893-4.199 1.2 1.999H9.598V4.6h3.344c.58 0 1.117.304 1.415.801ZM5.5 19.4a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm10.1-1.9a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0Z"
  })));
};

exports.ReactComponent = SvgCarStorke;
