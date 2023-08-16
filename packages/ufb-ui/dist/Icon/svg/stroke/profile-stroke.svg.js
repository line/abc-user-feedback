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
var SvgProfileStroke = function SvgProfileStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 2.15a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm-2.4 4.6a2.4 2.4 0 1 1 4.8 0 2.4 2.4 0 0 1-4.8 0ZM12 12.65c-4.217 0-6.945 1.913-8.318 3.232-1.029.988-1.165 2.41-.8 3.565l.073.234a3.1 3.1 0 0 0 2.957 2.169h12.177a3.1 3.1 0 0 0 2.956-2.17l.074-.233c.364-1.156.228-2.577-.8-3.564-1.374-1.32-4.101-3.233-8.319-3.233Zm-6.794 4.819C6.299 16.419 8.507 14.85 12 14.85c3.493 0 5.702 1.57 6.794 2.619.28.268.407.744.226 1.317l-.073.234a.9.9 0 0 1-.858.63H5.912a.9.9 0 0 1-.859-.63l-.073-.233c-.18-.573-.053-1.05.226-1.318Z"
  })));
};

exports.ReactComponent = SvgProfileStroke;
