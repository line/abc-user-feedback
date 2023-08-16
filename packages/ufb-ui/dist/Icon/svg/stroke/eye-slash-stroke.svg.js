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

var _path, _path2, _path3;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgEyeSlashStroke = function SvgEyeSlashStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.97 3.444a1.1 1.1 0 0 1 0 1.556l-2.022 2.022c1.21 1.25 2.247 2.778 3.05 4.517a1.1 1.1 0 0 1 0 .922C20.735 17.362 16.607 20.6 12 20.6c-1.588 0-3.12-.385-4.538-1.091L5 21.97a1.1 1.1 0 1 1-1.556-1.555l16.97-16.971a1.1 1.1 0 0 1 1.556 0Zm-3.576 5.132-2.841 2.84a3.6 3.6 0 0 1-4.136 4.136l-2.289 2.29A7.82 7.82 0 0 0 12 18.4c3.379 0 6.734-2.314 8.78-6.4-.67-1.338-1.48-2.485-2.385-3.424Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12 5.6c.968 0 1.935.19 2.87.558l1.668-1.668c-1.418-.705-2.95-1.09-4.539-1.09-4.606 0-8.734 3.238-10.998 8.139a1.1 1.1 0 0 0 0 .922c.803 1.738 1.84 3.267 3.05 4.516l1.554-1.554C4.7 14.485 3.89 13.337 3.22 12 5.267 7.914 8.622 5.6 12 5.6Z"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12.582 8.447a3.6 3.6 0 0 0-4.135 4.135l4.135-4.135Z"
  })));
};

exports.ReactComponent = SvgEyeSlashStroke;
