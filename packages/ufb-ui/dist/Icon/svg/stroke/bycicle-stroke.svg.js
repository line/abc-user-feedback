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
var SvgBycicleStroke = function SvgBycicleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.4 3.5a1.1 1.1 0 0 1 1.1-1.1h3.25a2.85 2.85 0 0 1 0 5.7h-1.224l1.4 4.2H19a4.6 4.6 0 1 1-2.205.563l-.999-2.996-.304.61-2.993 6.484a1.1 1.1 0 0 1-1 .639H9.548a4.601 4.601 0 1 1-3.511-5.183L7.3 9.931l-1.252-2.68h-1.8a1.1 1.1 0 1 1 0-2.2h5a1.1 1.1 0 1 1 0 2.2h-.772l.77 1.649h4.573l1.196-2.392A1.1 1.1 0 0 1 16 5.9h2.75a.65.65 0 1 0 0-1.3H15.5a1.1 1.1 0 0 1-1.1-1.1Zm-5.226 7.6-1.176 2.312A4.607 4.607 0 0 1 9.35 15.4h1.446l1.985-4.3H9.174ZM5 14.5a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm14 0a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"
  })));
};

exports.ReactComponent = SvgBycicleStroke;
