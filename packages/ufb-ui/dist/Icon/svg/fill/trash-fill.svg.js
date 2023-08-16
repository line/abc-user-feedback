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
var SvgTrashFill = function SvgTrashFill(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M13.145 1.892a.889.889 0 0 1 .435-.114h5.531c.491 0 .889.398.889.889v1.777c0 .491-.398.89-.889.89H4.89a.889.889 0 0 1 0-1.778h5.298l2.958-1.664Z"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.889 6.222a.889.889 0 0 0-.885.972l1.182 12.61a2.667 2.667 0 0 0 2.655 2.418h8.318a2.667 2.667 0 0 0 2.655-2.418l1.182-12.61a.889.889 0 0 0-.885-.972H4.89Zm6.444 10.063c0 .456-.398.826-.889.826-.49 0-.888-.37-.888-.826v-4.127c0-.456.398-.825.888-.825.491 0 .89.37.89.825v4.127Zm3.111 0c0 .456-.398.826-.888.826-.491 0-.89-.37-.89-.826v-4.127c0-.456.399-.825.89-.825.49 0 .888.37.888.825v4.127Z"
  })));
};

exports.ReactComponent = SvgTrashFill;
