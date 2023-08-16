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
var SvgSearch = function SvgSearch(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 10.516C2 5.813 5.844 2 10.585 2c4.741 0 8.585 3.813 8.585 8.516 0 2.022-.71 3.879-1.897 5.34l4.423 4.387a1.024 1.024 0 0 1 0 1.456 1.044 1.044 0 0 1-1.468 0l-4.442-4.407a8.592 8.592 0 0 1-5.201 1.74C5.844 19.032 2 15.219 2 10.516Zm8.585-6.457c-3.595 0-6.51 2.89-6.51 6.457 0 3.566 2.915 6.457 6.51 6.457 3.595 0 6.51-2.891 6.51-6.457s-2.915-6.457-6.51-6.457Z"
  })));
};

exports.ReactComponent = SvgSearch;
