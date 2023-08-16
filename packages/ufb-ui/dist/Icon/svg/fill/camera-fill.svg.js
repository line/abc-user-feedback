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
var SvgCameraFill = function SvgCameraFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M13.125 15.833a2.062 2.062 0 1 0 0-4.125 2.062 2.062 0 0 0 0 4.125Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9.917 3a.917.917 0 0 0-.796.462L7.55 6.208H3.75A2.75 2.75 0 0 0 1 8.958v9.625a2.75 2.75 0 0 0 2.75 2.75h16a2.75 2.75 0 0 0 2.75-2.75V8.958a2.75 2.75 0 0 0-2.75-2.75h-1.051l-1.57-2.746A.917.917 0 0 0 16.333 3H9.917Zm3.208 6.875a3.896 3.896 0 1 1 0 7.791 3.896 3.896 0 0 1 0-7.791Zm-7.083.291a1.375 1.375 0 1 1-2.75 0 1.375 1.375 0 0 1 2.75 0Z"
  })));
};

exports.ReactComponent = SvgCameraFill;
