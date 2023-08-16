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
var SvgCarFill = function SvgCarFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.092 3a2.75 2.75 0 0 0-2.46 1.52L.764 8.57a1.03 1.03 0 0 0-.108.517v6.662c0 .713.38 1.337.947 1.683a3.843 3.843 0 0 0 7.636.285h4.58a3.844 3.844 0 0 0 7.646-.563v-.023l1.55-1.459c.207-.195.325-.466.325-.75v-2.88c0-1.045-.56-2.009-1.468-2.526L18.9 8.136a1.03 1.03 0 0 0-.294-.112L15.92 4.355a3.609 3.609 0 0 0-2.818-1.354H5.092ZM3.355 8l1.123-2.558a.687.687 0 0 1 .614-.38h2.595V8H3.355Zm9.749-2.938c.47 0 .914.214 1.207.58L15.947 8H9.749V5.062h3.355ZM5.436 18.935a1.781 1.781 0 1 1 0-3.562 1.781 1.781 0 0 1 0 3.562Zm10.405-1.781a1.78 1.78 0 1 1 3.562 0 1.78 1.78 0 0 1-3.562 0Z"
  })));
};

exports.ReactComponent = SvgCarFill;
