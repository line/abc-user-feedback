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
var SvgBlock = function SvgBlock(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 1.4C6.146 1.4 1.4 6.146 1.4 12c0 5.854 4.746 10.6 10.6 10.6 5.854 0 10.6-4.746 10.6-10.6 0-5.854-4.746-10.6-10.6-10.6ZM3.6 12a8.4 8.4 0 0 1 13.511-6.667L5.333 17.111A8.363 8.363 0 0 1 3.6 12Zm16.8 0a8.4 8.4 0 0 1-13.51 6.667L18.666 6.889A8.363 8.363 0 0 1 20.4 12Z"
  })));
};

exports.ReactComponent = SvgBlock;
