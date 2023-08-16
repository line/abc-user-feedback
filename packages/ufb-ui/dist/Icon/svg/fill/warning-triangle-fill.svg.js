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
var SvgWarningTriangleFill = function SvgWarningTriangleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M11.59 2c-.716 0-1.376.39-1.726 1.02l-8.36 15.015a2.018 2.018 0 0 0-.026 1.912l.512.985A1.977 1.977 0 0 0 3.742 22h16.516c.735 0 1.41-.411 1.752-1.069l.512-.984c.313-.6.303-1.32-.026-1.912L14.136 3.02A1.976 1.976 0 0 0 12.411 2h-.822Zm1.466 12.476c-.02.704-.372 1.115-1.056 1.115-.69 0-1.035-.41-1.055-1.115l-.129-4.252a5.839 5.839 0 0 0-.004-.196 4.2 4.2 0 0 1-.002-.125c0-.759.446-1.203 1.197-1.203.744 0 1.184.444 1.184 1.203 0 .089-.007.212-.013.321l-.122 4.252Zm.223 3.24c0 .691-.575 1.231-1.279 1.231-.71 0-1.285-.54-1.285-1.23 0-.684.575-1.224 1.285-1.224.704 0 1.279.54 1.279 1.224Z"
  })));
};

exports.ReactComponent = SvgWarningTriangleFill;
