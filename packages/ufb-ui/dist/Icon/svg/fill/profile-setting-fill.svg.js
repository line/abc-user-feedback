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

var _path, _path2, _path3;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgProfileSettingFill = function SvgProfileSettingFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10 2.058a3.71 3.71 0 1 0 0 7.419 3.71 3.71 0 0 0 0-7.419Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M10 10.524c-3.4 0-5.6 1.543-6.707 2.607-.83.796-.939 1.942-.646 2.874l.06.189a2.5 2.5 0 0 0 2.384 1.749h5.587a2.13 2.13 0 0 1-.203-.294l-.03-.052a2.125 2.125 0 0 1 .302-2.527 3.327 3.327 0 0 1 0-.14 2.125 2.125 0 0 1-.303-2.527l.03-.053a2.125 2.125 0 0 1 2.346-1.003l.027-.016.083-.046c.03-.107.07-.21.115-.309A10.154 10.154 0 0 0 10 10.524Z"
  })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.803 10.833c-.6 0-1.128.398-1.292.974l-.102.36a4.984 4.984 0 0 0-.381.191c-.105.06-.217.138-.303.2l-.355-.09a1.345 1.345 0 0 0-1.492.63l-.032.056c-.3.518-.218 1.17.198 1.6l.258.266a3.896 3.896 0 0 0-.027.396c0 .13.014.283.027.397l-.258.265a1.338 1.338 0 0 0-.198 1.602l.032.054c.3.52.909.777 1.492.63l.343-.085c.085.067.198.15.309.213.12.07.276.138.39.186l.1.348c.163.576.69.974 1.291.974h.06c.6 0 1.128-.398 1.293-.974l.1-.354c.108-.047.25-.113.366-.18.11-.064.23-.15.321-.216l.354.089a1.345 1.345 0 0 0 1.492-.63l.032-.055c.299-.519.218-1.172-.199-1.602l-.257-.265a3.87 3.87 0 0 0 .026-.397c0-.13-.013-.282-.026-.396l.257-.265c.417-.43.498-1.083.199-1.601l-.032-.055c-.3-.52-.91-.777-1.492-.63l-.367.091a5.857 5.857 0 0 0-.316-.201 5.997 5.997 0 0 0-.354-.185l-.105-.367a1.343 1.343 0 0 0-1.292-.974h-.06Zm.028 5.45a.868.868 0 1 1-.002-1.735.868.868 0 0 1 .002 1.736Z"
  })));
};

exports.ReactComponent = SvgProfileSettingFill;
