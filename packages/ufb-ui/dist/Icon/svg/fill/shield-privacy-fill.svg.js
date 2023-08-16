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
var SvgShieldPrivacyFill = function SvgShieldPrivacyFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.344 2.352a.5.5 0 0 0-.688 0A11.459 11.459 0 0 1 3.604 5.5a.5.5 0 0 0-.481.343A12.49 12.49 0 0 0 2.5 9.751c0 5.825 3.984 10.718 9.375 12.106a.5.5 0 0 0 .25 0c5.39-1.388 9.375-6.281 9.375-12.106 0-1.364-.218-2.678-.623-3.908a.5.5 0 0 0-.481-.343h-.146a11.459 11.459 0 0 1-7.906-3.148Zm2.906 12.781v-2.666c0-.479-.364-.867-.813-.867 0-1.436-1.09-2.6-2.437-2.6-1.346 0-2.438 1.164-2.438 2.6-.448 0-.812.388-.812.867v2.666c0 .479.364.867.813.867h4.874c.45 0 .813-.388.813-.867ZM13.137 11.6c0-.67-.509-1.214-1.137-1.214s-1.138.544-1.138 1.214h2.275Z"
  })));
};

exports.ReactComponent = SvgShieldPrivacyFill;
