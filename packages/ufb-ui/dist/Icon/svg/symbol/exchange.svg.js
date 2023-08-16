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
var SvgExchange = function SvgExchange(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.778 3.722a1.1 1.1 0 0 1 0 1.556L5.656 6.4H20a1.1 1.1 0 0 1 0 2.2H5.656l1.122 1.122a1.1 1.1 0 1 1-1.556 1.556l-3-3a1.1 1.1 0 0 1 0-1.556l3-3a1.1 1.1 0 0 1 1.556 0ZM17.222 12.722a1.1 1.1 0 0 1 1.556 0l3 3a1.1 1.1 0 0 1 0 1.556l-3 3a1.1 1.1 0 1 1-1.556-1.556l1.122-1.122H4a1.1 1.1 0 0 1 0-2.2h14.344l-1.122-1.122a1.1 1.1 0 0 1 0-1.556Z"
  })));
};

exports.ReactComponent = SvgExchange;
