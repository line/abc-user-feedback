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
var SvgHeartFill = function SvgHeartFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 9.936c0-3.603 2.78-6.193 5.799-6.193 1.16 0 2.185.48 3.015 1.098.435.324.832.698 1.186 1.09a8.266 8.266 0 0 1 1.186-1.09c.83-.619 1.856-1.098 3.015-1.098 3.02 0 5.799 2.59 5.799 6.193 0 3.74-2.6 6.734-4.704 8.59a25.808 25.808 0 0 1-3.015 2.271c-.253.164-.738.414-1.103.598a51.265 51.265 0 0 1-.667.33l-.044.02-.016.008a1.039 1.039 0 0 1-.902 0l-.016-.007-.044-.022a35.214 35.214 0 0 1-.667-.33c-.365-.183-.85-.433-1.104-.597a25.809 25.809 0 0 1-3.014-2.272C4.6 16.67 2 13.677 2 9.936Z"
  })));
};

exports.ReactComponent = SvgHeartFill;
