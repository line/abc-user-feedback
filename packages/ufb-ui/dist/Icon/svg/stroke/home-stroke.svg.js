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
var SvgHomeStroke = function SvgHomeStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10.28 2.324a3.1 3.1 0 0 1 3.44 0l7.5 5a3.1 3.1 0 0 1 1.38 2.58V19.5a3.1 3.1 0 0 1-3.1 3.1h-4.861a1.1 1.1 0 0 1-1.1-1.1v-5.233H10.46V21.5a1.1 1.1 0 0 1-1.1 1.1H4.5a3.1 3.1 0 0 1-3.1-3.1V9.904a3.1 3.1 0 0 1 1.38-2.58l7.5-5Zm2.22 1.83a.9.9 0 0 0-1 0l-7.5 5a.9.9 0 0 0-.4.75V19.5a.9.9 0 0 0 .9.9H8.26v-5.233a1.1 1.1 0 0 1 1.1-1.1h5.278a1.1 1.1 0 0 1 1.1 1.1V20.4h3.76a.9.9 0 0 0 .9-.9V9.904a.9.9 0 0 0-.4-.75l-7.5-5Z"
  })));
};

exports.ReactComponent = SvgHomeStroke;
