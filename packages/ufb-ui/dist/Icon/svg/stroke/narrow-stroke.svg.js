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
var SvgNarrowStroke = function SvgNarrowStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M14.64 12.687a1.1 1.1 0 0 1 0-1.375l2-2.5a1.1 1.1 0 1 1 1.718 1.375L16.908 12l1.45 1.812a1.1 1.1 0 0 1-1.718 1.375l-2-2.5ZM9.358 11.313a1.1 1.1 0 0 1 0 1.374l-2 2.5a1.1 1.1 0 0 1-1.718-1.374L7.09 12l-1.45-1.813a1.1 1.1 0 0 1 1.718-1.374l2 2.5Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M.9 6A3.1 3.1 0 0 1 4 2.9h16A3.1 3.1 0 0 1 23.1 6v12a3.1 3.1 0 0 1-3.1 3.1H4A3.1 3.1 0 0 1 .9 18V6ZM4 5.1a.9.9 0 0 0-.9.9v12a.9.9 0 0 0 .9.9h16a.9.9 0 0 0 .9-.9V6a.9.9 0 0 0-.9-.9H4Z"
  })));
};

exports.ReactComponent = SvgNarrowStroke;
