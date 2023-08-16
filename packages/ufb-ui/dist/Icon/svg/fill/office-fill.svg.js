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
var SvgOfficeFill = function SvgOfficeFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 12 12",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.5 1A1.5 1.5 0 0 0 2 2.5V10h-.5a.5.5 0 0 0 0 1h3.25V8.812C4.75 8.088 5.31 7.5 6 7.5s1.25.588 1.25 1.313V11h3.25a.5.5 0 0 0 0-1H10V2.5A1.5 1.5 0 0 0 8.5 1h-5Zm3 4.5A.5.5 0 0 1 7 5h.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5ZM7 3a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H7Zm-3 .5a.5.5 0 0 1 .5-.5H5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5ZM4.5 5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 0-1h-.5Z"
  })));
};

exports.ReactComponent = SvgOfficeFill;
