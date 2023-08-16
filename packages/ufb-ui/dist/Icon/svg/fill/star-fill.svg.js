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
var SvgStarFill = function SvgStarFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10.184 3.048c.715-1.549 2.917-1.549 3.632 0l2.014 4.364 4.832.69c1.631.233 2.296 2.229 1.13 3.394l-3.456 3.458 1.053 5.265c.332 1.66-1.42 2.956-2.91 2.154L12 19.96l-4.48 2.412c-1.49.802-3.24-.494-2.909-2.154l1.054-5.265-3.458-3.458c-1.165-1.165-.5-3.16 1.132-3.394l4.831-.69 2.014-4.364Z"
  })));
};

exports.ReactComponent = SvgStarFill;
