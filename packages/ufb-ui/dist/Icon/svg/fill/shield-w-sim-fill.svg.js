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
var SvgShieldWSimFill = function SvgShieldWSimFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.344 2.352a.5.5 0 0 0-.688 0A11.459 11.459 0 0 1 3.604 5.5a.5.5 0 0 0-.481.343A12.49 12.49 0 0 0 2.5 9.751c0 5.825 3.984 10.718 9.375 12.106a.5.5 0 0 0 .25 0c5.39-1.388 9.375-6.281 9.375-12.106 0-1.364-.218-2.678-.623-3.908a.5.5 0 0 0-.481-.343h-.146a11.459 11.459 0 0 1-7.906-3.148ZM9.75 8a.9.9 0 0 0-.9.9v7.2a.9.9 0 0 0 .9.9h4.5a.9.9 0 0 0 .9-.9v-5.495a.9.9 0 0 0-.242-.614l-1.591-1.705A.9.9 0 0 0 12.659 8H9.75Z"
  })));
};

exports.ReactComponent = SvgShieldWSimFill;
