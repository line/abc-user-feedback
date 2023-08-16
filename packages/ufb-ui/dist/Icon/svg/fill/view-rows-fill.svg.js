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
var SvgViewRowsFill = function SvgViewRowsFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4 2h16c1.105 0 2 .82 2 1.833v1.834c0 1.012-.895 1.833-2 1.833H4c-1.105 0-2-.82-2-1.833V3.833C2 2.821 2.895 2 4 2ZM4 9.25h16c1.105 0 2 .82 2 1.833v1.834c0 1.012-.895 1.833-2 1.833H4c-1.105 0-2-.82-2-1.833v-1.834c0-1.012.895-1.833 2-1.833ZM4 16.5h16c1.105 0 2 .82 2 1.833v1.834C22 21.179 21.105 22 20 22H4c-1.105 0-2-.82-2-1.833v-1.834c0-1.012.895-1.833 2-1.833Z"
  })));
};

exports.ReactComponent = SvgViewRowsFill;
