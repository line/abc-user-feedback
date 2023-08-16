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
var SvgCallCircleFill = function SvgCallCircleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1 8.456-.804.805.018.033c.125.23.405.64 1.129 1.363.723.724 1.13 1.002 1.361 1.127l.018.01.016.008.804-.804c.48-.48 1.269-.515 1.887-.086l.83.54c.819.569.991 1.694.356 2.329l-.695.695c-.688.687-1.815.626-2.889.232-1.104-.406-2.324-1.216-3.424-2.315-1.1-1.1-1.909-2.32-2.314-3.424-.395-1.074-.456-2.201.231-2.889l.695-.695c.635-.635 1.76-.463 2.33.357l.537.827c.43.618.394 1.408-.086 1.887Z"
  })));
};

exports.ReactComponent = SvgCallCircleFill;
