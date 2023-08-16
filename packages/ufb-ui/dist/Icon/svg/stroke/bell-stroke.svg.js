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
var SvgBellStroke = function SvgBellStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M13.1 2.3a1.1 1.1 0 0 0-2.2 0v.665a7.1 7.1 0 0 0-6.613 6.68l-.282 4.946a6.9 6.9 0 0 1-.832 2.91l-.638 1.172A1.1 1.1 0 0 0 3.5 20.3h17a1.1 1.1 0 0 0 .966-1.627l-.639-1.171a6.9 6.9 0 0 1-.831-2.91l-.282-4.948a7.1 7.1 0 0 0-6.613-6.68V2.3ZM6.485 9.77a4.9 4.9 0 0 1 4.892-4.62h1.249a4.9 4.9 0 0 1 4.892 4.62l.283 4.947a9.099 9.099 0 0 0 .864 3.383H5.337a9.1 9.1 0 0 0 .864-3.383l.283-4.947Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10 21.1a1.1 1.1 0 0 0 0 2.2h4a1.1 1.1 0 0 0 0-2.2h-4Z"
  })));
};

exports.ReactComponent = SvgBellStroke;
