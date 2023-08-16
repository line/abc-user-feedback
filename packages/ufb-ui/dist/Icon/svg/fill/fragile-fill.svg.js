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
var SvgFragileFill = function SvgFragileFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M16.144 20.126c.509 0 .921.42.921.937a.929.929 0 0 1-.92.937H7.857a.929.929 0 0 1-.92-.937c0-.517.412-.937.92-.937h3.222v-3.17c-3.936-.091-6.888-3.74-6.192-7.709L6.03 2.74a.925.925 0 0 1 .907-.772h5.952L9.854 6.6a.951.951 0 0 0-.046.962c.16.305.472.495.812.495h1.175l-1.054 1.877a.946.946 0 0 0 .343 1.279.912.912 0 0 0 1.256-.349l1.841-3.28a.951.951 0 0 0-.003-.934.918.918 0 0 0-.796-.467H12.34l2.729-4.165a.962.962 0 0 0 .03-.051h1.965c.446 0 .828.325.907.772l1.142 6.507c.696 3.969-2.255 7.617-6.191 7.71v3.17h3.222Z"
  })));
};

exports.ReactComponent = SvgFragileFill;
