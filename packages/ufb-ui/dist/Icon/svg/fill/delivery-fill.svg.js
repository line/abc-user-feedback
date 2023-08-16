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
var SvgDeliveryFill = function SvgDeliveryFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.75 15.059v-2.142h-.917a.917.917 0 1 1 0-1.833h.917v1.832h6.417a.917.917 0 0 0 0-1.833H3.75V9.25H1.917a.917.917 0 1 1 0-1.834H3.75V9.25h3.667a.917.917 0 1 0 0-1.833H3.75V2.833H15.5a2 2 0 0 1 2 2v.333h2.933c.419 0 .784.284.888.689l1.65 5.917c.02.074.029.151.029.228v5.5c0 .506-.41.917-.917.917h-1.865a3.209 3.209 0 0 1-6.352 0H8.3a3.209 3.209 0 1 1-4.551-3.358Zm17.151-3.976L19.723 7H17.5v4.083h3.401ZM3.917 17.958a1.208 1.208 0 1 0 2.416 0 1.208 1.208 0 0 0-2.416 0Zm11.916 0a1.208 1.208 0 1 0 2.417 0 1.208 1.208 0 0 0-2.417 0Z"
  })));
};

exports.ReactComponent = SvgDeliveryFill;
