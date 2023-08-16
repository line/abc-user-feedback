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
var SvgBikeFill = function SvgBikeFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.369 21.098a3.886 3.886 0 0 1-3.612-5.325l-.474-1.54a2.939 2.939 0 0 1 .204-2.223l1.688-3.235h-.65a1.043 1.043 0 1 1 0-2.086h7.109a1.043 1.043 0 0 1 0 2.086h-.379v1.706h3.196l2.123-2.654h-.2a1.043 1.043 0 1 1 0-2.085H15.7v-.948c0-1.1.891-1.991 1.99-1.991h3.792c.576 0 1.043.467 1.043 1.043v2.938c0 .576-.467 1.043-1.043 1.043h-3.052l2.749 5.498h.777c.576 0 1.043.467 1.043 1.043v.948c0 .575-.467 1.042-1.043 1.042h-.473a3.886 3.886 0 0 1-7.538 1.896H9.115a3.888 3.888 0 0 1-3.745 2.844Zm0-5.688a1.801 1.801 0 1 0 0 3.602 1.801 1.801 0 0 0 0-3.602Zm12.323 0a1.801 1.801 0 1 0 0 3.602 1.801 1.801 0 0 0 0-3.602Z"
  })));
};

exports.ReactComponent = SvgBikeFill;
