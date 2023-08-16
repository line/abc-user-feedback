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
var SvgMoonStroke = function SvgMoonStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.854 2.065c.323.2.52.554.52.935 0 4.086 1.013 6.937 2.85 8.775 1.839 1.838 4.69 2.85 8.776 2.85a1.1 1.1 0 0 1 .985 1.59 10.593 10.593 0 0 1-9.492 5.885C6.643 22.1 1.9 17.357 1.9 11.506c0-4.16 2.4-7.76 5.885-9.491a1.1 1.1 0 0 1 1.069.05ZM7.25 4.95A8.393 8.393 0 1 0 19.049 16.75c-3.511-.287-6.346-1.384-8.38-3.418-2.034-2.034-3.132-4.87-3.418-8.38Z"
  })));
};

exports.ReactComponent = SvgMoonStroke;
