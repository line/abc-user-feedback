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
var SvgBagStroke = function SvgBagStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 1.25c-2.538 0-4.328 1.851-4.685 4.15h-.944a3.1 3.1 0 0 0-3.093 2.894l-.733 11A3.1 3.1 0 0 0 5.638 22.6h12.724a3.1 3.1 0 0 0 3.093-3.306l-.733-11A3.1 3.1 0 0 0 17.629 5.4h-.944C16.328 3.101 14.538 1.25 12 1.25Zm0 2c1.304 0 2.335.862 2.65 2.15h-5.3c.315-1.288 1.346-2.15 2.65-2.15ZM4.74 19.44l.733-11a.9.9 0 0 1 .898-.84h.879V10a1 1 0 1 0 2 0V7.6h5.5V10a1 1 0 1 0 2 0V7.6h.879a.9.9 0 0 1 .898.84l.733 11a.9.9 0 0 1-.898.96H5.638a.9.9 0 0 1-.898-.96Z"
  })));
};

exports.ReactComponent = SvgBagStroke;
