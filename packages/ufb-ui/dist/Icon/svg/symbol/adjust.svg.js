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
var SvgAdjust = function SvgAdjust(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M4 9V2.5M4 9a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 2.5V11m8-2V2.5M12 9a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 2.5V11M8 5V2.5M8 5a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 6.5V7",
    stroke: "currentColor",
    strokeWidth: 1.467,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};

exports.ReactComponent = SvgAdjust;
