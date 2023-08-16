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
var SvgExchangeCircleFill = function SvgExchangeCircleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM8.364 7.91a.91.91 0 0 1 1.818 0v5.986l.266-.266a.91.91 0 1 1 1.286 1.286l-1.818 1.818a.91.91 0 0 1-1.286 0l-1.818-1.818a.91.91 0 0 1 1.285-1.286l.267.266V7.91Zm5.72-.644a.91.91 0 0 1 1.286 0l1.818 1.818a.91.91 0 0 1-1.285 1.286l-.267-.266v5.987a.91.91 0 1 1-1.818 0v-5.987l-.266.266a.91.91 0 1 1-1.286-1.286l1.818-1.818Z"
  })));
};

exports.ReactComponent = SvgExchangeCircleFill;
