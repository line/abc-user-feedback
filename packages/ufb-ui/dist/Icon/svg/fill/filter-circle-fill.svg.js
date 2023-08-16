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
var SvgFilterCircleFill = function SvgFilterCircleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.999 12c0-5.523 4.477-10 10-10 5.524 0 10 4.477 10 10s-4.476 10-10 10C6.476 22 2 17.523 2 12Zm6.397-3.694a.991.991 0 0 0 0 1.982h7.207a.991.991 0 0 0 0-1.982H8.396Zm.9 3.153a.991.991 0 1 0 0 1.982h5.406a.991.991 0 1 0 0-1.982H9.297Zm5.496 4.144a.991.991 0 0 0-.99-.99h-3.604a.991.991 0 0 0 0 1.981H13.8a.991.991 0 0 0 .991-.99Z"
  })));
};

exports.ReactComponent = SvgFilterCircleFill;
