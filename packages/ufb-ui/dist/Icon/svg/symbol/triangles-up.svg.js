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
var SvgTrianglesUp = function SvgTrianglesUp(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M16.274 8.97c.518.6.089 1.53-.707 1.53H8.434c-.796 0-1.225-.93-.707-1.53l3.567-4.146a.933.933 0 0 1 1.414 0l3.567 4.146Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    opacity: 0.25,
    d: "M7.726 15.03c-.518-.6-.089-1.53.707-1.53h7.135c.795 0 1.224.93.706 1.53l-3.567 4.146a.933.933 0 0 1-1.414 0L7.726 15.03Z"
  })));
};

exports.ReactComponent = SvgTrianglesUp;
