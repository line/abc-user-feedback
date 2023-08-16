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

var _path, _path2, _path3;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgCameraStroke = function SvgCameraStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9.4 13.5a4.1 4.1 0 1 1 8.2 0 4.1 4.1 0 0 1-8.2 0Zm4.1-1.9a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.204 12a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10.182 2.4a1.1 1.1 0 0 0-.964.57L7.713 5.705H3.818A2.918 2.918 0 0 0 .9 8.624v10.058A2.918 2.918 0 0 0 3.818 21.6h16.364a2.918 2.918 0 0 0 2.918-2.918V8.624a2.918 2.918 0 0 0-2.918-2.919h-1.168L17.509 2.97a1.1 1.1 0 0 0-.964-.57h-6.363Zm-.855 4.936L10.832 4.6h5.063L17.4 7.336a1.1 1.1 0 0 0 .963.57h1.819c.396 0 .718.32.718.718v10.058a.718.718 0 0 1-.718.718H3.818a.718.718 0 0 1-.718-.718V8.624c0-.397.321-.719.718-.719h4.546a1.1 1.1 0 0 0 .963-.57Z"
  })));
};

exports.ReactComponent = SvgCameraStroke;
