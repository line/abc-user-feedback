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
var SvgEyeSlashFill = function SvgEyeSlashFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.97 5a1.1 1.1 0 1 0-1.555-1.556L3.444 20.414A1.1 1.1 0 1 0 5 21.97l2.777-2.777a9.58 9.58 0 0 0 4.222.997c4.359 0 8.263-3.063 10.405-7.699a1.04 1.04 0 0 0 0-.872c-.748-1.62-1.711-3.047-2.834-4.22l2.4-2.4Zm-6.595 6.595a3.405 3.405 0 0 1-3.835 3.835l3.835-3.835Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12 8.65c.121 0 .242.006.36.019l3.788-3.788c-1.3-.622-2.7-.961-4.149-.961-4.357 0-8.261 3.063-10.403 7.699a1.04 1.04 0 0 0 0 .873c.736 1.593 1.68 3 2.78 4.161l4.237-4.238A3.405 3.405 0 0 1 12 8.65Z"
  })));
};

exports.ReactComponent = SvgEyeSlashFill;
