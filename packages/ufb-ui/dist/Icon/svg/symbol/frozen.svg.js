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
var SvgFrozen = function SvgFrozen(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10.637 2.103a1.1 1.1 0 1 0-1.274 1.794l1.648 1.17v5.221L6.841 7.88l-.567-2.368a1.1 1.1 0 0 0-2.14.511l.42 1.757-1.604.381a1.1 1.1 0 1 0 .508 2.14l2.251-.534L9.8 12.13l-3.946 2.278-2.334-.694a1.1 1.1 0 0 0-.626 2.11l1.731.514-.472 1.58a1.1 1.1 0 0 0 2.108.63l.662-2.217 4.09-2.36v4.557L9.242 20.2a1.1 1.1 0 0 0 1.513 1.598l1.312-1.243 1.132 1.2a1.1 1.1 0 1 0 1.6-1.511l-1.589-1.682v-4.464l4.217 2.434.277 1.86a1.1 1.1 0 1 0 2.176-.323l-.233-1.568 1.603-.734a1.1 1.1 0 0 0-.916-2l-1.839.841-4.296-2.48 4.441-2.564 1.75.69a1.1 1.1 0 0 0 .807-2.046l-1.474-.582.166-1.756a1.1 1.1 0 0 0-2.19-.206l-.19 2.013-4.299 2.481V5.031l1.473-1.17a1.1 1.1 0 1 0-1.368-1.722l-1.242.986-1.437-1.022Z"
  })));
};

exports.ReactComponent = SvgFrozen;
