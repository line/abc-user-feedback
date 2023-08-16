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
var SvgStoreStroke = function SvgStoreStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "m23.1 7-.14-.538-1.67-2.977A3.1 3.1 0 0 0 18.588 1.9H5.413A3.1 3.1 0 0 0 2.71 3.485L1.04 6.462.9 7v1.143a4 4 0 0 0 1 2.652V19A3.1 3.1 0 0 0 5 22.1h7a1.1 1.1 0 0 0 1.1-1.1v-4.9h2.8V21a1.1 1.1 0 0 0 1.1 1.1h2a3.1 3.1 0 0 0 3.1-3.1v-8.205a4 4 0 0 0 1-2.652V7ZM3.877 5.9l.751-1.34a.9.9 0 0 1 .785-.46h13.174a.9.9 0 0 1 .785.46l.75 1.34H3.878Zm2.579 2.2c0 1-.78 1.8-1.678 1.8C3.88 9.9 3.1 9.1 3.1 8.1h3.356Zm7.222 0c0 1-.78 1.8-1.678 1.8-.898 0-1.678-.8-1.678-1.8h3.356Zm7.222 0c0 1-.78 1.8-1.678 1.8-.897 0-1.678-.8-1.678-1.8H20.9Zm-5.289 1.485c.561 1.461 1.95 2.515 3.611 2.515.232 0 .458-.02.678-.06V19a.9.9 0 0 1-.9.9h-.9V15a1.1 1.1 0 0 0-1.1-1.1h-5a1.1 1.1 0 0 0-1.1 1.1v4.9H5a.9.9 0 0 1-.9-.9v-6.96c.22.04.446.06.678.06 1.66 0 3.05-1.054 3.611-2.515C8.95 11.046 10.339 12.1 12 12.1c1.66 0 3.05-1.054 3.611-2.515Z"
  })));
};

exports.ReactComponent = SvgStoreStroke;
