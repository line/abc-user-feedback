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
var SvgReportFill = function SvgReportFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M14.1 2.782c.412.372.716.864.87 1.454h1.198v4.618H7.856V4.236H9.03c.154-.59.458-1.082.87-1.454C10.493 2.246 11.261 2 12 2c.74 0 1.507.246 2.1.782Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16.63 10.24c.51 0 .923-.414.923-.924v-5.08h.16a2.61 2.61 0 0 1 2.61 2.61v12.558a2.61 2.61 0 0 1-2.61 2.61H6.312a2.61 2.61 0 0 1-2.61-2.61V6.846a2.61 2.61 0 0 1 2.61-2.61h.16v5.08c0 .51.414.923.924.923h9.235Zm-3.579 8.874a1.154 1.154 0 1 0 0-2.31 1.154 1.154 0 0 0 0 2.31Zm3.232 0a1.154 1.154 0 1 0 0-2.309 1.154 1.154 0 0 0 0 2.309Z"
  })));
};

exports.ReactComponent = SvgReportFill;
