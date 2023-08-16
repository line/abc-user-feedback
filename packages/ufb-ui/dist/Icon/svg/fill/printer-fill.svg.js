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

var _path, _path2, _path3;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgPrinterFill = function SvgPrinterFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.819 2.5a.864.864 0 0 0-.864.864V5.09h12.09V3.364a.864.864 0 0 0-.863-.864H6.82Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M18.91 17.182a2.59 2.59 0 0 0 2.59-2.59V8.977a2.59 2.59 0 0 0-2.59-2.591H5.09a2.59 2.59 0 0 0-2.59 2.59v5.614a2.59 2.59 0 0 0 2.59 2.591v-5.025c0-.563.443-1.02.988-1.02h11.844c.545 0 .987.457.987 1.02v5.025Zm-.26-8.506a.95.95 0 1 1-1.9 0 .95.95 0 0 1 1.9 0Z"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.818 13.648c0-.433.332-.785.74-.785h8.884c.409 0 .74.352.74.785v7.067c0 .433-.331.785-.74.785H7.559c-.41 0-.74-.352-.74-.785v-7.067Z"
  })));
};

exports.ReactComponent = SvgPrinterFill;
