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
var SvgDocumentStroke = function SvgDocumentStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M7.65 8a1.1 1.1 0 0 1 1.1-1.1h6.5a1.1 1.1 0 0 1 0 2.2h-6.5A1.1 1.1 0 0 1 7.65 8ZM7.65 12a1.1 1.1 0 0 1 1.1-1.1h6.5a1.1 1.1 0 0 1 0 2.2h-6.5a1.1 1.1 0 0 1-1.1-1.1ZM8.75 14.9a1.1 1.1 0 0 0 0 2.2h3a1.1 1.1 0 0 0 0-2.2h-3Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.9 4.5A3.1 3.1 0 0 1 6 1.4h12a3.1 3.1 0 0 1 3.1 3.1v16a2.1 2.1 0 0 1-2.1 2.1H5a2.1 2.1 0 0 1-2.1-2.1v-16ZM6 3.6a.9.9 0 0 0-.9.9v15.9h13.8V4.5a.9.9 0 0 0-.9-.9H6Z"
  })));
};

exports.ReactComponent = SvgDocumentStroke;
