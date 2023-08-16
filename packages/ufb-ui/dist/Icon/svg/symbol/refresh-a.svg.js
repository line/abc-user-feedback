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
var SvgRefreshA = function SvgRefreshA(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12 5.1a6.873 6.873 0 0 0-4.744 1.89 1.1 1.1 0 0 1-1.512-1.598 9.1 9.1 0 0 1 15.322 5.817l.873-.952a1.1 1.1 0 0 1 1.622 1.486l-2.75 3a1.1 1.1 0 0 1-1.622 0l-2.75-3a1.1 1.1 0 0 1 1.622-1.486l.782.853A6.901 6.901 0 0 0 12 5.1ZM12 18.9a6.877 6.877 0 0 0 5.01-2.156 1.1 1.1 0 0 1 1.598 1.512 9.1 9.1 0 0 1-15.674-5.465l-.873.952a1.1 1.1 0 1 1-1.622-1.486l2.75-3a1.1 1.1 0 0 1 1.622 0l2.75 3a1.1 1.1 0 0 1-1.622 1.486l-.782-.853A6.901 6.901 0 0 0 12 18.9Z"
  })));
};

exports.ReactComponent = SvgRefreshA;
