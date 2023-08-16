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
var SvgGlobeStroke = function SvgGlobeStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 17 16",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.247 4.893c.254.183.52.35.797.501.15-.67.357-1.287.612-1.828a5.296 5.296 0 0 0-1.409 1.327ZM8.5 1.267a6.731 6.731 0 0 0-6.52 8.418 6.736 6.736 0 0 0 13.04 0 6.744 6.744 0 0 0-.653-4.99A6.731 6.731 0 0 0 8.5 1.266Zm0 1.466c-.401 0-.962.344-1.465 1.352a7.41 7.41 0 0 0-.612 1.88 7.27 7.27 0 0 0 2.077.302c.722 0 1.42-.106 2.077-.301a7.409 7.409 0 0 0-.612-1.88C9.461 3.076 8.901 2.732 8.5 2.732Zm3.456 2.661a8.772 8.772 0 0 0-.612-1.828 5.295 5.295 0 0 1 1.409 1.327c-.254.183-.52.35-.797.501ZM10.753 7.44a8.744 8.744 0 0 1-2.253.293 8.744 8.744 0 0 1-2.253-.293 10.675 10.675 0 0 0 .184 2.637 11.33 11.33 0 0 0 4.138 0c.126-.634.198-1.335.198-2.077 0-.19-.005-.377-.014-.56Zm1.37 2.232a12.48 12.48 0 0 0 .065-2.753 8.726 8.726 0 0 0 1.262-.723 5.297 5.297 0 0 1 .22 2.818c-.496.256-1.013.476-1.548.658Zm-2.027 1.962a12.854 12.854 0 0 1-3.192 0c.042.097.086.19.13.28.504 1.008 1.065 1.353 1.466 1.353s.961-.345 1.465-1.352c.045-.09.089-.184.13-.28Zm1.248.8c.163-.346.307-.723.428-1.125.366-.097.725-.21 1.078-.338a5.295 5.295 0 0 1-1.506 1.463Zm-5.688 0a8.15 8.15 0 0 1-.428-1.125c-.366-.097-.725-.21-1.078-.338.399.582.912 1.08 1.506 1.463Zm-2.325-3.42c.495.256 1.012.476 1.546.658a12.479 12.479 0 0 1-.065-2.753 8.726 8.726 0 0 1-1.262-.723 5.298 5.298 0 0 0-.22 2.818Z"
  })));
};

exports.ReactComponent = SvgGlobeStroke;
