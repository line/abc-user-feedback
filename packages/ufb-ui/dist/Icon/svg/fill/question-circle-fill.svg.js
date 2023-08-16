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
var SvgQuestionCircleFill = function SvgQuestionCircleFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-10.321 2.129c.485 0 .752-.267.854-.725.09-.574.294-.868 1.203-1.394.964-.568 1.463-1.272 1.463-2.304 0-1.593-1.305-2.66-3.247-2.66-1.47 0-2.563.582-3 1.484-.138.26-.206.52-.206.814 0 .52.335.854.875.854.417 0 .725-.191.896-.629.218-.608.67-.936 1.34-.936.751 0 1.27.465 1.27 1.135 0 .628-.266.97-1.148 1.497-.806.471-1.223 1.005-1.223 1.811v.096c0 .56.342.957.923.957Zm.013 3.042c.623 0 1.121-.472 1.121-1.073 0-.602-.498-1.074-1.12-1.074-.616 0-1.115.472-1.115 1.074 0 .601.5 1.073 1.114 1.073Z"
  })));
};

exports.ReactComponent = SvgQuestionCircleFill;
