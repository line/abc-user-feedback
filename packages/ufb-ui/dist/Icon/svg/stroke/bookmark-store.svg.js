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
var SvgBookmarkStore = function SvgBookmarkStore(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.9 4.5A3.1 3.1 0 0 1 6 1.4h12a3.1 3.1 0 0 1 3.1 3.1v16.33c0 1.587-1.693 2.6-3.092 1.85L12 19.463l-6.008 3.219c-1.4.75-3.092-.264-3.092-1.851V4.5ZM6 3.6a.9.9 0 0 0-.9.9v16.163l5.908-3.165a2.1 2.1 0 0 1 1.984 0l5.908 3.165V4.5a.9.9 0 0 0-.9-.9H6Z"
  })));
};

exports.ReactComponent = SvgBookmarkStore;
