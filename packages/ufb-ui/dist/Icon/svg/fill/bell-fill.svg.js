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
var SvgBellFill = function SvgBellFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.948 3.048a.947.947 0 1 0-1.895 0v.72a6.632 6.632 0 0 0-6.269 6.24l-.263 4.55a6.631 6.631 0 0 1-.799 2.793l-.606 1.112a.947.947 0 0 0 .831 1.4h16.106a.947.947 0 0 0 .831-1.4l-.606-1.112a6.63 6.63 0 0 1-.799-2.793l-.263-4.55a6.632 6.632 0 0 0-6.268-6.24v-.72ZM10.105 20.759a1 1 0 1 0 0 2h3.79a1 1 0 1 0 0-2h-3.79Z"
  })));
};

exports.ReactComponent = SvgBellFill;
