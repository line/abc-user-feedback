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
var SvgOut = function SvgOut(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M14.1 17a1.1 1.1 0 0 0-2.2 0v1a.9.9 0 0 1-.9.9H6a.9.9 0 0 1-.9-.9V6a.9.9 0 0 1 .9-.9h5a.9.9 0 0 1 .9.9v1a1.1 1.1 0 0 0 2.2 0V6A3.1 3.1 0 0 0 11 2.9H6A3.1 3.1 0 0 0 2.9 6v12A3.1 3.1 0 0 0 6 21.1h5a3.1 3.1 0 0 0 3.1-3.1v-1Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M18.085 7.784a1.1 1.1 0 0 0-1.67 1.432l1.443 1.684H10.75a1.1 1.1 0 0 0 0 2.2h7.108l-1.443 1.684a1.1 1.1 0 0 0 1.67 1.432l3-3.5a1.1 1.1 0 0 0 0-1.432l-3-3.5Z"
  })));
};

exports.ReactComponent = SvgOut;
