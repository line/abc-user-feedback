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
var SvgCalendarAFill = function SvgCalendarAFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M8.1 2c.539 0 .976.437.976.976v1.463h5.853V2.976a.976.976 0 0 1 1.951 0v1.463h1.951a2.927 2.927 0 0 1 2.927 2.927v1.462H2.247V7.366a2.927 2.927 0 0 1 2.926-2.927h1.952V2.976c0-.54.436-.976.975-.976Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.758 19.073A2.927 2.927 0 0 1 18.831 22H5.173a2.927 2.927 0 0 1-2.926-2.927v-8.294h19.511v8.294Zm-7.538-.134a1.22 1.22 0 1 0 0-2.439 1.22 1.22 0 0 0 0 2.439Zm3.414 0a1.22 1.22 0 1 0 0-2.439 1.22 1.22 0 0 0 0 2.439Z"
  })));
};

exports.ReactComponent = SvgCalendarAFill;
