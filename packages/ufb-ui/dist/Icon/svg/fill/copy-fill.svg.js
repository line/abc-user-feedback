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
var SvgCopyFill = function SvgCopyFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M8.667 5.333A3.333 3.333 0 0 1 12 2h6.667A3.333 3.333 0 0 1 22 5.333V12a3.333 3.333 0 0 1-3.333 3.333H12A3.333 3.333 0 0 1 8.667 12V5.333Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M15.333 18.667A3.333 3.333 0 0 1 12 22H5.333A3.333 3.333 0 0 1 2 18.667V12a3.333 3.333 0 0 1 3.333-3.333h.865v4.691a4.444 4.444 0 0 0 4.444 4.444h4.691v.865Z"
  })));
};

exports.ReactComponent = SvgCopyFill;
