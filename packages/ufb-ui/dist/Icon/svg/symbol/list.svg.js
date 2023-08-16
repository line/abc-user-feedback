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
var SvgList = function SvgList(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 6A1.1 1.1 0 0 1 9 4.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 6ZM6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 12A1.1 1.1 0 0 1 9 10.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 12ZM6 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 18A1.1 1.1 0 0 1 9 16.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 18Z"
  })));
};

exports.ReactComponent = SvgList;
