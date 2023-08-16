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
var SvgChannelFill = function SvgChannelFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 12 12",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M6.324 6.41h-.83l.188-.863h.836l-.194.863Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.5 1A1.5 1.5 0 0 0 1 2.5v7A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 11 9.5v-7A1.5 1.5 0 0 0 9.5 1h-7Zm1.497 7.383c-.012.074.031.117.1.117h.836c.062 0 .106-.037.119-.099l.218-.992h.83l-.213.974c-.018.074.02.117.1.117h.83c.062 0 .1-.037.112-.099l.225-.992h.643c.062 0 .106-.037.118-.099l.175-.777c.012-.08-.031-.123-.106-.123h-.612l.194-.863h.648c.063 0 .1-.043.113-.099l.168-.783c.019-.074-.018-.117-.093-.117H7.79l.206-.93c.025-.075-.019-.118-.093-.118h-.836a.115.115 0 0 0-.119.092l-.218.956H5.9l.206-.93c.025-.075-.019-.118-.094-.118h-.83c-.068 0-.112.037-.124.092l-.212.956h-.643c-.056 0-.1.043-.112.099l-.169.783c-.018.074.019.117.1.117h.605l-.193.863H3.79c-.062 0-.1.037-.112.099l-.175.783c-.018.074.025.117.1.117h.612l-.219.974Z"
  })));
};

exports.ReactComponent = SvgChannelFill;
