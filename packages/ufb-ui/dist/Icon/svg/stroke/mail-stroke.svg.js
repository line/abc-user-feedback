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
var SvgMailStroke = function SvgMailStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.25 6.75A3.25 3.25 0 0 1 4.5 3.5h15a3.25 3.25 0 0 1 3.25 3.25v10.5a3.25 3.25 0 0 1-3.25 3.25h-15a3.25 3.25 0 0 1-3.25-3.25V6.75Zm2 0v.243c0 .434.225.837.595 1.064l7.5 4.616a1.25 1.25 0 0 0 1.31 0l7.5-4.616c.37-.227.595-.63.595-1.064V6.75c0-.69-.56-1.25-1.25-1.25h-15c-.69 0-1.25.56-1.25 1.25Zm17.5 3.29-7.047 4.336a3.25 3.25 0 0 1-3.406 0L3.25 10.04v7.21c0 .69.56 1.25 1.25 1.25h15c.69 0 1.25-.56 1.25-1.25v-7.21Z"
  })));
};

exports.ReactComponent = SvgMailStroke;
