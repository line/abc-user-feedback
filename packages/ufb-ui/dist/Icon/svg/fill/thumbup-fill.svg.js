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
var SvgThumbupFill = function SvgThumbupFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M11.938 2.4c-.427 0-.523.04-.889.192l-.213.088c-.582.235-1.2.71-1.398 1.555-.068.291-.424 1.476-.958 2.868-.43 1.122-.945 2.3-1.48 3.22V21.6h10.542c1.317 0 2.45-.955 2.648-2.266l1.045-6.84a3.1 3.1 0 0 0-3.064-3.568H13.67l.821-3.665c0-.541-.098-1.23-.491-1.816C13.56 2.79 12.846 2.4 11.938 2.4ZM3.5 10.4a1.1 1.1 0 0 0-1.1 1.1v9a1.1 1.1 0 0 0 1.1 1.1h2V10.4h-2Z"
  })));
};

exports.ReactComponent = SvgThumbupFill;
