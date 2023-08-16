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
var SvgUpload = function SvgUpload(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.716 3.165a1.1 1.1 0 0 0-1.432 0l-3.5 3a1.1 1.1 0 1 0 1.432 1.67L10.9 6.392V14a1.1 1.1 0 0 0 2.2 0V6.392l1.684 1.443a1.1 1.1 0 0 0 1.432-1.67l-3.5-3Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M4 10.4a1.1 1.1 0 0 1 1.1 1.1V18a.9.9 0 0 0 .9.9h12a.9.9 0 0 0 .9-.9v-6.5a1.1 1.1 0 0 1 2.2 0V18a3.1 3.1 0 0 1-3.1 3.1H6A3.1 3.1 0 0 1 2.9 18v-6.5A1.1 1.1 0 0 1 4 10.4Z"
  })));
};

exports.ReactComponent = SvgUpload;
