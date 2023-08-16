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

var _path, _path2;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgTicketStroke = function SvgTicketStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.5 10.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM7.75 15a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 3.4A1.1 1.1 0 0 0 .9 4.5v15A1.1 1.1 0 0 0 2 20.6h3.684a1.1 1.1 0 0 0 .668-.226l1.437-1.097 1.438 1.097a1.1 1.1 0 0 0 .668.226H22a1.1 1.1 0 0 0 1.1-1.1v-15A1.1 1.1 0 0 0 22 3.4H9.895a1.1 1.1 0 0 0-.668.226L7.79 4.723 6.352 3.626a1.1 1.1 0 0 0-.668-.226H2Zm3.312 2.2 1.81 1.382c.394.3.94.3 1.335 0l1.81-1.382H20.9v12.8H10.267l-1.81-1.381a1.1 1.1 0 0 0-1.335 0L5.312 18.4H3.1V5.6h2.212Z"
  })));
};

exports.ReactComponent = SvgTicketStroke;
