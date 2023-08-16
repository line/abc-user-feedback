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
var SvgStoreFill = function SvgStoreFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M5.126 2.858 3.45 5.35h17.1l-1.675-2.492a.81.81 0 0 0-.673-.358H5.798a.81.81 0 0 0-.672.358ZM5.139 11.05c1.457 0 2.639-1.216 2.639-2.715V7.249H2.5v1.086c0 1.499 1.181 2.714 2.639 2.714ZM14.639 8.335c0 1.499-1.182 2.714-2.639 2.714-1.457 0-2.639-1.215-2.639-2.714V7.249h5.278v1.086ZM18.861 11.05c-1.457 0-2.639-1.216-2.639-2.715V7.249H21.5v1.086c0 1.499-1.181 2.714-2.639 2.714ZM20.55 19.5a2 2 0 0 1-2 2h-1.08a.72.72 0 0 1-.72-.72v-4.03a.95.95 0 0 0-.95-.95h-1.9a.95.95 0 0 0-.95.95v4.03a.72.72 0 0 1-.72.72H5.45a2 2 0 0 1-2-2v-6.877a4.467 4.467 0 0 0 1.69.328 4.477 4.477 0 0 0 3.43-1.594A4.477 4.477 0 0 0 12 12.951a4.477 4.477 0 0 0 3.43-1.594 4.477 4.477 0 0 0 3.431 1.594c.601 0 1.17-.117 1.69-.328V19.5Z"
  })));
};

exports.ReactComponent = SvgStoreFill;
