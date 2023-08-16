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

var _g, _defs;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgProfileCircleStroke = function SvgProfileCircleStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#profile-circle-stroke_svg__a)",
    fillRule: "evenodd",
    clipRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M7.9 9.2a4.1 4.1 0 1 1 8.2 0 4.1 4.1 0 0 1-8.2 0ZM12 7.3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM3.1 12a8.9 8.9 0 1 1 16.223 5.06c-.2-.153-.42-.31-.66-.467-1.465-.957-3.67-1.893-6.663-1.893-2.992 0-5.198.936-6.664 1.893-.24.157-.46.314-.659.467A8.86 8.86 0 0 1 3.1 12Zm14.752 6.706A8.866 8.866 0 0 1 12 20.9a8.866 8.866 0 0 1-5.852-2.194c.122-.09.252-.18.39-.27C7.699 17.677 9.493 16.9 12 16.9c2.508 0 4.302.778 5.461 1.535.14.091.27.182.39.271Z"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "profile-circle-stroke_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h24v24H0z"
  })))));
};

exports.ReactComponent = SvgProfileCircleStroke;
