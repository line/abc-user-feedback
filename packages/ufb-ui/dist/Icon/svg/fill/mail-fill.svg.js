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
var SvgMailFill = function SvgMailFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "m1.278 6.32 1.192.806.002.001 1.391.942 7.482 4.604a1.25 1.25 0 0 0 1.31 0l7.482-4.604 1.371-.928.009-.006.01-.007.001-.001h.001l.001-.001h.001v-.001l.002-.001.004-.003.002-.001.003-.002.001-.001.006-.004.004-.003h.001l1.168-.79A3.25 3.25 0 0 0 19.5 3.5h-15a3.25 3.25 0 0 0-3.222 2.82ZM22.75 8.714l-.079.054-.008.005-.002.001-.007.005-.001.001h-.001l-.001.001h-.001v.001l-.002.001-.002.001-.002.002h-.002v.002h-.002l-.003.002v.001l-.007.004-.004.003h-.001l-1.385.938a1.029 1.029 0 0 1-.037.024l-7.5 4.615a3.25 3.25 0 0 1-3.406 0l-7.5-4.615a1.005 1.005 0 0 1-.037-.024l-1.41-.954-.1-.068v8.535A3.25 3.25 0 0 0 4.5 20.5h15a3.25 3.25 0 0 0 3.25-3.25V8.715Z"
  })));
};

exports.ReactComponent = SvgMailFill;
