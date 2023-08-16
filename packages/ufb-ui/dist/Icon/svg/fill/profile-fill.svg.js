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
var SvgProfileFill = function SvgProfileFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M7.548 6.921a4.451 4.451 0 1 1 8.902 0 4.451 4.451 0 0 1-8.902 0ZM3.952 15.757C5.28 14.48 7.92 12.63 12 12.63c4.08 0 6.72 1.85 8.048 3.127.995.956 1.127 2.331.775 3.45l-.071.226a3 3 0 0 1-2.861 2.099H6.109a3 3 0 0 1-2.86-2.1l-.072-.226c-.352-1.118-.22-2.493.775-3.449Z"
  })));
};

exports.ReactComponent = SvgProfileFill;
