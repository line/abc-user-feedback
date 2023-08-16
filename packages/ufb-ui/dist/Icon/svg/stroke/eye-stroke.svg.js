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
var SvgEyeStroke = function SvgEyeStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.4 12a3.6 3.6 0 1 1 7.2 0 3.6 3.6 0 0 1-7.2 0Zm3.6-1.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.438 10.657C3.768 6.257 7.676 3.4 11.999 3.4c4.325 0 8.232 2.858 10.563 7.257.445.84.445 1.846 0 2.686-2.33 4.4-6.238 7.257-10.563 7.257-4.323 0-8.23-2.858-10.561-7.257a2.869 2.869 0 0 1 0-2.686ZM11.999 5.6c-3.29 0-6.554 2.192-8.617 6.087a.669.669 0 0 0 0 .626c2.063 3.895 5.327 6.087 8.617 6.087 3.292 0 6.556-2.192 8.619-6.087a.669.669 0 0 0 0-.626C18.555 7.792 15.29 5.6 11.999 5.6Z"
  })));
};

exports.ReactComponent = SvgEyeStroke;
