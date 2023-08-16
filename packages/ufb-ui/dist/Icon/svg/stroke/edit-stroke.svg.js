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
var SvgEditStroke = function SvgEditStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.207 5.262a2 2 0 0 0 0-2.828l-.47-.47a2 2 0 0 0-2.828 0l-8.443 8.443a2 2 0 0 0-.535.968l-.377 1.645a1.333 1.333 0 0 0 1.598 1.597l1.645-.377a2 2 0 0 0 .967-.535l8.443-8.443Zm-.943-1.885c.26.26.26.682 0 .943l-1.672 1.672L10.18 4.58l1.672-1.673c.26-.26.682-.26.942 0l.47.47ZM9.237 5.522l1.412 1.413-5.828 5.827a.667.667 0 0 1-.322.178l-1.645.378.377-1.646a.667.667 0 0 1 .178-.322l5.828-5.828Z"
  })));
};

exports.ReactComponent = SvgEditStroke;
