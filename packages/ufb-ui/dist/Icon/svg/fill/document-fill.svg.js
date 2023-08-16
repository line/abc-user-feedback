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
var SvgDocumentFill = function SvgDocumentFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M6.34 2a2.925 2.925 0 0 0-2.925 2.925v15.094c0 1.094.887 1.981 1.981 1.981h13.208a1.981 1.981 0 0 0 1.98-1.981V4.925A2.925 2.925 0 0 0 17.66 2H6.34Zm2.594 7.264a1.038 1.038 0 1 1 0-2.075h6.132a1.038 1.038 0 0 1 0 2.075H8.934ZM7.896 12c0-.573.465-1.038 1.038-1.038h6.132a1.038 1.038 0 0 1 0 2.076H8.934A1.038 1.038 0 0 1 7.896 12Zm1.038 4.811a1.038 1.038 0 0 1 0-2.075h2.83a1.038 1.038 0 1 1 0 2.075h-2.83Z"
  })));
};

exports.ReactComponent = SvgDocumentFill;
