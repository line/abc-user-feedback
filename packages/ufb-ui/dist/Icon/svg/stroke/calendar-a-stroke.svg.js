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
var SvgCalendarAStroke = function SvgCalendarAStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M18 16.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13.25 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8 1.4a1.1 1.1 0 0 1 1.1 1.1v1.4h5.8V2.5a1.1 1.1 0 0 1 2.2 0v1.4H19A3.1 3.1 0 0 1 22.1 7v12a3.1 3.1 0 0 1-3.1 3.1H5A3.1 3.1 0 0 1 1.9 19V7A3.1 3.1 0 0 1 5 3.9h1.9V2.5A1.1 1.1 0 0 1 8 1.4ZM5 6.1a.9.9 0 0 0-.9.9v1.4h15.8V7a.9.9 0 0 0-.9-.9H5Zm14 13.8a.9.9 0 0 0 .9-.9v-8.4H4.1V19a.9.9 0 0 0 .9.9h14Z"
  })));
};

exports.ReactComponent = SvgCalendarAStroke;
