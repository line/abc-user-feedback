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
var SvgThumbupStroke = function SvgThumbupStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10.836 2.68c.556-.225 1.171-.28 1.671-.28.908 0 1.623.39 2.062 1.045.392.586.49 1.275.49 1.816v3.665h3.112a3.1 3.1 0 0 1 3.064 3.568l-1.045 6.84v.001a2.672 2.672 0 0 1-2.648 2.265H3.5a1.1 1.1 0 0 1-1.1-1.1v-9a1.1 1.1 0 0 1 1.1-1.1h3.454c.551-.93 1.085-2.144 1.526-3.297.534-1.392.89-2.577.958-2.868.198-.846.816-1.32 1.398-1.555Zm.738 2.083c-.11.45-.498 1.716-1.04 3.127-.504 1.317-1.178 2.862-1.934 4.031V19.4h8.942c.246 0 .44-.176.472-.394v-.002l1.047-6.842a.9.9 0 0 0-.89-1.036H14.96a2.1 2.1 0 0 1-2.1-2.1V5.261c0-.321-.066-.513-.12-.592-.018-.027-.029-.034-.037-.038a.435.435 0 0 0-.196-.031c-.375 0-.667.047-.845.119a.498.498 0 0 0-.088.044ZM4.6 12.6v6.8h1.8v-6.8H4.6Z"
  })));
};

exports.ReactComponent = SvgThumbupStroke;
