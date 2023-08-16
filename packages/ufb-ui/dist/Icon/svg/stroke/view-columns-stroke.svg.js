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
var SvgViewColumnsStroke = function SvgViewColumnsStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 5.625C2 4.451 2.951 3.5 4.125 3.5h15.75C21.049 3.5 22 4.451 22 5.625v12.75a2.125 2.125 0 0 1-2.125 2.125H4.125A2.125 2.125 0 0 1 2 18.375V5.625ZM10 18.5h4v-13h-4v13Zm-2-13v13H4.125A.125.125 0 0 1 4 18.375V5.625c0-.069.056-.125.125-.125H8Zm8 0v13h3.875a.125.125 0 0 0 .125-.125V5.625a.125.125 0 0 0-.125-.125H16Z"
  })));
};

exports.ReactComponent = SvgViewColumnsStroke;
