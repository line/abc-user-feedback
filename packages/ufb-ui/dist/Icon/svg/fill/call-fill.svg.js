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
var SvgCallFill = function SvgCallFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m8.572 10.595 1.529-1.528c.91-.911.978-2.411.162-3.586L9.242 3.909C8.16 2.352 6.023 2.025 4.817 3.232l-1.32 1.32C2.19 5.86 2.305 8 3.055 10.041c.77 2.098 2.309 4.416 4.398 6.505 2.089 2.09 4.407 3.628 6.505 4.398 2.041.75 4.182.866 5.489-.44l1.32-1.32c1.207-1.207.88-3.344-.677-4.426l-1.575-1.024c-1.175-.817-2.675-.749-3.586.162l-1.528 1.528a4.123 4.123 0 0 1-.056-.03l-.008-.004c-.438-.238-1.212-.767-2.587-2.141-1.374-1.375-1.906-2.152-2.145-2.59l-.004-.009-.03-.055Z"
  })));
};

exports.ReactComponent = SvgCallFill;
