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
var SvgBubbleDotsFill = function SvgBubbleDotsFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M6.143 2.5a4.88 4.88 0 0 0-4.881 4.881v7.321a4.88 4.88 0 0 0 4.88 4.881h5.491l3.629 3.175a.976.976 0 0 0 1.581-.466l.774-2.709h.24a4.881 4.881 0 0 0 4.88-4.88V7.38a4.881 4.881 0 0 0-4.88-4.881H6.143ZM8 10a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 8 10Zm5.25 1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM16.006 10a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
  })));
};

exports.ReactComponent = SvgBubbleDotsFill;
