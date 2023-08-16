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
var SvgWarm = function SvgWarm(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.725 4.077a1.1 1.1 0 1 0-1.45-1.654c-.706.619-1.416 1.952-1.665 3.603-.258 1.71-.041 3.854 1.234 6.14l.015.028.017.026c1.836 2.893 1.145 5.79-.29 7.943a1.1 1.1 0 1 0 1.83 1.22c1.747-2.62 2.757-6.472.335-10.314-1.016-1.834-1.153-3.473-.965-4.715.197-1.308.737-2.1.94-2.277ZM6.006 8.521a1.1 1.1 0 1 0-1.968-.983c-.56 1.121-.513 2.412-.247 3.587.27 1.192.799 2.414 1.388 3.517 1.102 2.061.417 4.002-.935 5.354A1.1 1.1 0 0 0 5.8 21.55c1.835-1.834 3-4.802 1.32-7.946-.54-1.009-.973-2.037-1.183-2.966-.214-.946-.166-1.647.07-2.118ZM18.607 8.521a1.1 1.1 0 0 0-1.968-.983c-.56 1.121-.513 2.412-.247 3.587.27 1.192.799 2.414 1.388 3.517 1.102 2.061.416 4.002-.935 5.354a1.1 1.1 0 0 0 1.556 1.555c1.834-1.834 3-4.802 1.32-7.946-.54-1.009-.973-2.037-1.183-2.966-.215-.946-.167-1.647.069-2.118Z"
  })));
};

exports.ReactComponent = SvgWarm;
