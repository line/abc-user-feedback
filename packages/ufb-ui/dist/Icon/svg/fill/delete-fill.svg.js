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
var SvgDeleteFill = function SvgDeleteFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7.837 3.25a2.98 2.98 0 0 0-2.528 1.401l-3.606 5.77a2.98 2.98 0 0 0 0 3.159l3.606 5.769a2.98 2.98 0 0 0 2.528 1.401H19.75a2.98 2.98 0 0 0 2.981-2.98V6.23a2.98 2.98 0 0 0-2.98-2.98H7.836Zm2.223 6.613a1.058 1.058 0 1 1 1.496-1.495l2.136 2.136 2.137-2.136a1.058 1.058 0 0 1 1.496 1.495L15.188 12l2.137 2.137a1.058 1.058 0 1 1-1.496 1.496l-2.137-2.137-2.136 2.137a1.058 1.058 0 0 1-1.496-1.496L12.196 12 10.06 9.863Z"
  })));
};

exports.ReactComponent = SvgDeleteFill;
