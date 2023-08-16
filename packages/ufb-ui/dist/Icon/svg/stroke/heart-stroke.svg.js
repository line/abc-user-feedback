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
var SvgHeartStroke = function SvgHeartStroke(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.4 9.764C1.4 5.944 4.346 3.2 7.547 3.2c1.229 0 2.316.508 3.196 1.163.46.344.881.74 1.257 1.157a8.76 8.76 0 0 1 1.257-1.157c.88-.655 1.967-1.163 3.196-1.163 3.2 0 6.147 2.745 6.147 6.564 0 3.965-2.756 7.138-4.987 9.105a27.35 27.35 0 0 1-3.195 2.408c-.268.173-.782.438-1.17.633a55.08 55.08 0 0 1-.706.35l-.047.022-.017.009a1.101 1.101 0 0 1-.956 0l-.017-.009-.047-.022a41.435 41.435 0 0 1-.707-.35c-.387-.195-.9-.46-1.17-.633a27.344 27.344 0 0 1-3.195-2.408C4.156 16.902 1.4 13.729 1.4 9.764ZM12 20.078s1.182-.69 1.534-.918a22.115 22.115 0 0 0 2.58-1.944c1.841-1.623 4.286-4.251 4.286-7.166 0-2.724-1.736-4.65-3.9-4.65-.93 0-2.5.9-3.5 2.4-.287.287-.41.41-.557.48-.108.052-.23.076-.443.117-.213-.041-.335-.065-.443-.117-.147-.07-.27-.193-.557-.48-1-1.5-2.57-2.4-3.5-2.4-2.164 0-3.9 1.926-3.9 4.65 0 2.915 2.445 5.543 4.285 7.166a22.11 22.11 0 0 0 2.582 1.944 71.23 71.23 0 0 0 1.533.918Z"
  })));
};

exports.ReactComponent = SvgHeartStroke;
