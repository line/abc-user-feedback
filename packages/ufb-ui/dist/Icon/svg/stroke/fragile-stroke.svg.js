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
var SvgFragileStroke = function SvgFragileStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.417 2.057A1.1 1.1 0 0 1 6.5 1.15h11a1.1 1.1 0 0 1 1.083.907l1.24 6.945c.762 4.264-2.435 8.187-6.723 8.343v3.305h3.4a1.1 1.1 0 0 1 0 2.2h-9a1.1 1.1 0 0 1 0-2.2h3.4v-3.305c-4.288-.157-7.484-4.08-6.723-8.343l1.24-6.945ZM7.421 3.35 6.343 9.389a4.9 4.9 0 0 0 4.823 5.761h1.668a4.9 4.9 0 0 0 4.823-5.761L16.58 3.35h-2.931l-1.278 2.3h1.13a1.1 1.1 0 0 1 .956 1.646l-2 3.5a1.1 1.1 0 0 1-1.91-1.092l1.059-1.854H10.5a1.1 1.1 0 0 1-.961-1.634L11.13 3.35H7.42Z"
  })));
};

exports.ReactComponent = SvgFragileStroke;
