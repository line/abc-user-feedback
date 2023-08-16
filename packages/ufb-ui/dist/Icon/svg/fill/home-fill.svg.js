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
var SvgHomeFill = function SvgHomeFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10.494 2.965a2.67 2.67 0 0 1 3.012 0l6.785 4.612A2.782 2.782 0 0 1 21.5 9.88v8.853c0 1.528-1.215 2.767-2.714 2.767H15a.896.896 0 0 1-.64-.27.932.932 0 0 1-.265-.652V16.5a1 1 0 0 0-1-1h-2.19a1 1 0 0 0-1 1v4.078c0 .244-.096.479-.265.652-.17.173-.4.27-.64.27H5.214c-1.499 0-2.714-1.24-2.714-2.767V9.88c0-.925.454-1.79 1.209-2.303l6.785-4.612Z"
  })));
};

exports.ReactComponent = SvgHomeFill;
