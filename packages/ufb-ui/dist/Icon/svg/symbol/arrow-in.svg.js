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
var SvgArrowIn = function SvgArrowIn(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.028 2.972a1.1 1.1 0 0 1 0 1.556L16.656 8.9H18.5a1.1 1.1 0 0 1 0 2.2H14a1.1 1.1 0 0 1-1.1-1.1V5.5a1.1 1.1 0 0 1 2.2 0v1.844l4.372-4.372a1.1 1.1 0 0 1 1.556 0ZM4.4 14a1.1 1.1 0 0 1 1.1-1.1H10a1.1 1.1 0 0 1 1.1 1.1v4.5a1.1 1.1 0 0 1-2.2 0v-1.844l-4.372 4.372a1.1 1.1 0 1 1-1.556-1.556L7.344 15.1H5.5A1.1 1.1 0 0 1 4.4 14Z"
  })));
};

exports.ReactComponent = SvgArrowIn;
