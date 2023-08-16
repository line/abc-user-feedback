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
var SvgWarningTriangleStroke = function SvgWarningTriangleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M13.067 14.276c-.02.704-.376 1.115-1.067 1.115-.697 0-1.046-.41-1.066-1.115l-.13-4.252c0-.057-.002-.118-.004-.176v-.02a4.23 4.23 0 0 1-.003-.125c0-.759.451-1.203 1.21-1.203.752 0 1.196.444 1.196 1.203 0 .089-.006.212-.013.321l-.123 4.252ZM13.292 17.517c0 .69-.58 1.23-1.292 1.23-.718 0-1.299-.54-1.299-1.23 0-.684.581-1.224 1.3-1.224.71 0 1.291.54 1.291 1.224Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M11.585 1.9a2.1 2.1 0 0 0-1.83 1.07L1.308 17.986a2.1 2.1 0 0 0-.028 2.008l.518.984A2.1 2.1 0 0 0 3.657 22.1h16.687a2.1 2.1 0 0 0 1.858-1.122l.518-.984a2.1 2.1 0 0 0-.028-2.008L14.246 2.97a2.1 2.1 0 0 0-1.83-1.07h-.831ZM3.252 19.017 11.644 4.1h.713l8.39 14.917-.464.883H3.717l-.465-.883Z"
  })));
};

exports.ReactComponent = SvgWarningTriangleStroke;
