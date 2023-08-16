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
var SvgReportStroke = function SvgReportStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.25 19a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM17 17.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.972 3.65a3.82 3.82 0 0 0-1.18-1.98C14 .97 12.98.65 12 .65c-.98 0-2 .32-2.792 1.02a3.819 3.819 0 0 0-1.18 1.98H5.826A2.926 2.926 0 0 0 2.9 6.576v13.598A2.926 2.926 0 0 0 5.826 23.1h12.348a2.926 2.926 0 0 0 2.926-2.926V6.576a2.926 2.926 0 0 0-2.926-2.926h-2.202ZM5.1 6.576c0-.4.325-.726.726-.726H6.4v2.9a1.1 1.1 0 0 0 1.1 1.1h9a1.1 1.1 0 0 0 1.1-1.1v-2.9h.574c.401 0 .726.325.726.726v13.598a.726.726 0 0 1-.726.726H5.826a.726.726 0 0 1-.726-.726V6.576Zm8.234-3.259c.313.277.566.72.566 1.433v1.1h1.5v1.8H8.6v-1.8h1.5v-1.1c0-.712.254-1.156.567-1.433C11 3.022 11.48 2.85 12 2.85s1 .172 1.334.467Z"
  })));
};

exports.ReactComponent = SvgReportStroke;
