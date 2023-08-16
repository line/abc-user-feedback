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
var SvgCreditcardStroke = function SvgCreditcardStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1 6.066A3.069 3.069 0 0 1 4.072 3h15.856A3.069 3.069 0 0 1 23 6.066v11.868A3.069 3.069 0 0 1 19.928 21H4.072A3.069 3.069 0 0 1 1 17.934V6.066Zm3.072-.89a.891.891 0 0 0-.892.89V8h17.64V6.066c0-.492-.4-.89-.892-.89H4.072Zm15.856 13.648a.891.891 0 0 0 .892-.89V10H3.18v7.934c0 .492.4.89.892.89h15.856Z"
  })));
};

exports.ReactComponent = SvgCreditcardStroke;
