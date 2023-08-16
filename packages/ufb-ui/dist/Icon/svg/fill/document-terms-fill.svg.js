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
var SvgDocumentTermsFill = function SvgDocumentTermsFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5 1.667c-.92 0-1.667.746-1.667 1.666v13.334c0 .92.746 1.666 1.667 1.666h10c.92 0 1.667-.746 1.667-1.666V5.345a.833.833 0 0 0-.245-.589l-2.845-2.845a.833.833 0 0 0-.589-.244H5Zm1.667 4.166a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834V6.667a.833.833 0 0 0-.834-.834H6.667Zm0 5a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834v-1.666a.833.833 0 0 0-.834-.834H6.667Zm4.166-4.166c0-.46.373-.834.834-.834h1.666c.46 0 .834.374.834.834v1.666c0 .46-.373.834-.834.834h-1.666a.833.833 0 0 1-.834-.834V6.667Zm.834 4.166a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834v-1.666a.833.833 0 0 0-.834-.834h-1.666Z"
  })));
};

exports.ReactComponent = SvgDocumentTermsFill;
