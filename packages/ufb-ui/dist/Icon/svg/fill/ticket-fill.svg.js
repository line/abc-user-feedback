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
var SvgTicketFill = function SvgTicketFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M2 3.4A1.1 1.1 0 0 0 .9 4.5v15A1.1 1.1 0 0 0 2 20.6h3.684a1.1 1.1 0 0 0 .668-.226l1.437-1.097 1.438 1.097a1.1 1.1 0 0 0 .668.226H22a1.1 1.1 0 0 0 1.1-1.1v-15A1.1 1.1 0 0 0 22 3.4H9.895a1.1 1.1 0 0 0-.668.226L7.79 4.723 6.352 3.626a1.1 1.1 0 0 0-.668-.226H2Zm4.5 6.35a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm0 4.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Z"
  })));
};

exports.ReactComponent = SvgTicketFill;
