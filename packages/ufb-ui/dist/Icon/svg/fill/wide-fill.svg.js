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
var SvgWideFill = function SvgWideFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.864 3.41A2.864 2.864 0 0 0 1 6.273v11.455a2.864 2.864 0 0 0 2.864 2.864h15.272A2.864 2.864 0 0 0 22 17.728V6.273a2.864 2.864 0 0 0-2.864-2.863H3.864Zm3.073 11.573-1.91-2.386a.955.955 0 0 1 0-1.193l1.91-2.386a.955.955 0 1 1 1.49 1.193L6.997 12l1.432 1.79a.955.955 0 0 1-1.491 1.192Zm9.127-5.965 1.909 2.386a.955.955 0 0 1 0 1.193l-1.91 2.386a.954.954 0 1 1-1.49-1.192L16.005 12l-1.432-1.79a.955.955 0 0 1 1.49-1.193Z"
  })));
};

exports.ReactComponent = SvgWideFill;
