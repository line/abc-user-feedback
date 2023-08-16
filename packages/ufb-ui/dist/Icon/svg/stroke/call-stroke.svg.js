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
var SvgCallStroke = function SvgCallStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "m9.345 10.179 1.028-1.028a3.088 3.088 0 0 0 .387-3.894l-1.25-1.88a3.088 3.088 0 0 0-4.754-.472L3.248 4.413c-1.493 1.492-1.493 3.805-.801 5.971.711 2.227 2.241 4.649 4.38 6.788 2.14 2.14 4.562 3.67 6.789 4.381 2.166.692 4.479.692 5.971-.8l1.509-1.509a3.088 3.088 0 0 0-.473-4.754l-1.88-1.25a3.088 3.088 0 0 0-3.894.387l-1.028 1.028a4.955 4.955 0 0 1-.058-.029l-.008-.004c-.461-.232-1.269-.76-2.443-1.934-1.175-1.174-1.702-1.982-1.934-2.443l-.004-.008-.029-.058Zm8.184 4.885 1.88 1.25c.471.314.537.98.137 1.38l-1.508 1.509c-.615.615-1.865.866-3.756.263-1.83-.585-3.96-1.899-5.905-3.843-1.944-1.945-3.258-4.075-3.843-5.905-.603-1.89-.352-3.141.263-3.756l1.508-1.508a.896.896 0 0 1 1.38.137l1.251 1.88a.896.896 0 0 1-.112 1.13L7.336 9.09c-.196.196-.31.46-.32.737v.041a1.403 1.403 0 0 0 .009.164c.008.085.025.187.053.304.057.236.16.534.343.897.365.723 1.05 1.715 2.341 3.006 1.29 1.29 2.283 1.976 3.006 2.34.363.184.661.287.897.344a2.365 2.365 0 0 0 .42.062H14.174c.278-.01.541-.124.737-.32l1.488-1.488a.896.896 0 0 1 1.13-.112Z"
  })));
};

exports.ReactComponent = SvgCallStroke;
