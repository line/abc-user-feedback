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
var SvgMarkerStroke = function SvgMarkerStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.5 10.5C2.5 4.924 6.777 1 12 1s9.5 3.924 9.5 9.5c0 5.412-3.424 9.135-8.11 12.609a1.993 1.993 0 0 1-1.186.391h-.408c-.425 0-.842-.136-1.187-.391C5.924 19.635 2.5 15.912 2.5 10.5ZM12 3c-4.166 0-7.5 3.076-7.5 7.5 0 4.402 2.716 7.603 7.297 11h.406c4.58-3.397 7.297-6.598 7.297-11C19.5 6.076 16.166 3 12 3Z"
  })));
};

exports.ReactComponent = SvgMarkerStroke;
