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
var SvgDeliveryStroke = function SvgDeliveryStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.9 3.5A1.1 1.1 0 0 1 3 2.4h11a3.1 3.1 0 0 1 3.08 2.75h2.091a3.1 3.1 0 0 1 2.858 1.9l1.585 3.774a1.1 1.1 0 0 1 .086.426v4a3.1 3.1 0 0 1-3.1 3.1h-.002a3.6 3.6 0 0 1-7.197 0H8.1a3.6 3.6 0 1 1-.675-2.2h6.651c.229-.317.508-.596.825-.824V5.5a.9.9 0 0 0-.9-.9H3a1.1 1.1 0 0 1-1.1-1.1Zm15.2 11.151a3.596 3.596 0 0 1 2.824 1.499h.676a.9.9 0 0 0 .9-.9v-2.9h-4.4v2.301Zm2.9-6.75a.9.9 0 0 0-.829-.551H17.1v2.8h3.845l-.944-2.248ZM3.1 18.25a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm12.5 0a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M.4 8a1.1 1.1 0 0 1 1.1-1.1H8a1.1 1.1 0 1 1 0 2.2H1.5A1.1 1.1 0 0 1 .4 8ZM1.9 12A1.1 1.1 0 0 1 3 10.9h7a1.1 1.1 0 0 1 0 2.2H3A1.1 1.1 0 0 1 1.9 12Z"
  })));
};

exports.ReactComponent = SvgDeliveryStroke;
