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
var SvgSquareCheck = function SvgSquareCheck(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M18.878 7.922a1.1 1.1 0 0 1 0 1.556l-7.5 7.5a1.1 1.1 0 0 1-1.556 0l-4.5-4.5a1.1 1.1 0 1 1 1.556-1.556l3.722 3.722 6.722-6.722a1.1 1.1 0 0 1 1.556 0Z",
    fill: "#fff"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm13.322 5.922a1.1 1.1 0 0 1 1.556 1.556l-7.5 7.5a1.1 1.1 0 0 1-1.556 0l-4.5-4.5a1.1 1.1 0 1 1 1.556-1.556l3.722 3.722 6.722-6.722Z"
  })));
};

exports.ReactComponent = SvgSquareCheck;
