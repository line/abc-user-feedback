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
var SvgBikeStroke = function SvgBikeStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M18 2.3a2.1 2.1 0 0 0-2.1 2.1v1h-1.4a1.1 1.1 0 0 0 0 2.2h.211l-2.24 2.8h-3.37V8.6H9.5a1.1 1.1 0 1 0 0-2.2H2a1.1 1.1 0 1 0 0 2.2h.685l-1.78 3.413A3.1 3.1 0 0 0 .69 14.36l.5 1.624A4.1 4.1 0 1 0 8.95 18.6h5.1a4.102 4.102 0 0 0 7.951-2h.5a1.1 1.1 0 0 0 1.1-1.1v-1a1.1 1.1 0 0 0-1.1-1.1h-.821l-2.9-5.8H22a1.1 1.1 0 0 0 1.1-1.1V3.4A1.1 1.1 0 0 0 22 2.3h-4ZM6.9 11.5A1.1 1.1 0 0 0 8 12.6h5a1.1 1.1 0 0 0 .86-.412l2.925-3.658 2.546 5.091a4.102 4.102 0 0 0-5.281 2.78h-5.1a4.102 4.102 0 0 0-6.071-2.41l-.086-.28a.9.9 0 0 1 .062-.68L5.167 8.6H6.9v2.9ZM5 19.4a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm13 0a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm2.9-14h-2.8v-.9h2.8v.9Z"
  })));
};

exports.ReactComponent = SvgBikeStroke;
