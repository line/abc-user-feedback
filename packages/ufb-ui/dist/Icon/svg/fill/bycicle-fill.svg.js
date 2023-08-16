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
var SvgBycicleFill = function SvgBycicleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.513 12.325a4.263 4.263 0 1 0 4.214 4.911h1.81c.397 0 .759-.231.925-.592l2.774-6.01.282-.564.925 2.776a4.263 4.263 0 1 0 1.976-.52L17.12 8.431h1.134a2.641 2.641 0 1 0 0-5.282h-3.011a1.02 1.02 0 1 0 0 2.039h3.011a.602.602 0 1 1 0 1.205h-2.548c-.386 0-.74.218-.912.563l-1.108 2.217H9.449l-.714-1.529h.717a1.02 1.02 0 0 0 0-2.039H4.818a1.02 1.02 0 1 0 0 2.039h1.667l1.16 2.485-1.172 2.303a4.281 4.281 0 0 0-.96-.108Zm-2.224 4.263a2.224 2.224 0 1 1 4.448 0 2.224 2.224 0 0 1-4.448 0Zm12.974 0a2.224 2.224 0 1 1 4.448 0 2.224 2.224 0 0 1-4.448 0Z"
  })));
};

exports.ReactComponent = SvgBycicleFill;
