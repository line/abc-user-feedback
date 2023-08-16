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
var SvgEditFill = function SvgEditFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 21 20",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M19.284 1.625c1.086 1.086 1.016 2.916-.155 4.087L16.62 8.221l-4.584-4.585 2.509-2.508c1.171-1.171 3.001-1.241 4.087-.155l.652.652ZM10.622 5.05l-8.741 8.742a3.177 3.177 0 0 0-.827 1.427L.42 17.617c-.37 1.398.823 2.591 2.22 2.22l2.399-.634a3.178 3.178 0 0 0 1.427-.827l8.741-8.741-4.584-4.584Z"
  })));
};

exports.ReactComponent = SvgEditFill;
