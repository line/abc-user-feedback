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
var SvgTrashStroke = function SvgTrashStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M14.841 1.5a1 1 0 0 0-.41.088L11.293 3H4.5a1 1 0 1 0 0 2h15a1 1 0 0 0 1-1V2.5a1 1 0 0 0-1-1H14.84ZM10.25 12.15a1.1 1.1 0 0 1 1.1 1.1v3a1.1 1.1 0 0 1-2.2 0v-3a1.1 1.1 0 0 1 1.1-1.1ZM14.85 13.25a1.1 1.1 0 0 0-2.2 0v3a1.1 1.1 0 0 0 2.2 0v-3Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.5 5.9a1.1 1.1 0 0 0-1.095 1.203l1.244 13.273A3.005 3.005 0 0 0 7.641 23.1h8.718c1.55 0 2.847-1.18 2.992-2.724l1.244-13.273A1.1 1.1 0 0 0 19.5 5.9h-15Zm2.34 14.27L5.707 8.1h12.584L17.16 20.17a.805.805 0 0 1-.8.73H7.64a.805.805 0 0 1-.8-.73Z"
  })));
};

exports.ReactComponent = SvgTrashStroke;
