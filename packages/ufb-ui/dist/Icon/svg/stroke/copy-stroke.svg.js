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
var SvgCopyStroke = function SvgCopyStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.833 5.667A3.167 3.167 0 0 1 12 2.5h6.333A3.167 3.167 0 0 1 21.5 5.667V12a3.167 3.167 0 0 1-3.167 3.167H12A3.167 3.167 0 0 1 8.833 12V5.667ZM12 4.61c-.583 0-1.056.473-1.056 1.056V12c0 .583.473 1.056 1.056 1.056h6.333c.583 0 1.056-.473 1.056-1.056V5.667c0-.583-.473-1.056-1.056-1.056H12Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M5.667 10.944c-.583 0-1.056.473-1.056 1.056v6.333c0 .583.473 1.056 1.056 1.056H12c.583 0 1.056-.473 1.056-1.056v-.82h2.11v.82A3.167 3.167 0 0 1 12 21.5H5.667A3.167 3.167 0 0 1 2.5 18.333V12a3.167 3.167 0 0 1 3.167-3.167h.82v2.111h-.82Z"
  })));
};

exports.ReactComponent = SvgCopyStroke;
