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
var SvgStarStroke = function SvgStarStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10.018 2.683c.78-1.69 3.184-1.69 3.964 0l1.98 4.29 4.761.68c1.781.255 2.507 2.434 1.235 3.706l-3.407 3.407 1.04 5.199c.361 1.811-1.55 3.226-3.177 2.35L12 19.938l-4.415 2.377c-1.626.876-3.538-.539-3.175-2.35l1.04-5.199-3.408-3.407c-1.272-1.272-.546-3.45 1.235-3.705l4.76-.68 1.98-4.29ZM12 3.725 9.813 8.463a1.118 1.118 0 0 1-.857.639l-5.258.75 3.756 3.756c.264.264.379.643.306 1.01l-1.135 5.675 4.845-2.61c.33-.177.73-.177 1.06 0l4.845 2.61-1.135-5.675a1.118 1.118 0 0 1 .306-1.01l3.755-3.755-5.257-.751a1.118 1.118 0 0 1-.857-.639L12 3.725Z"
  })));
};

exports.ReactComponent = SvgStarStroke;
