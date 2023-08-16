'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var reactHotToast = require('react-hot-toast');
var Icon = require('../Icon/Icon.js');

const ToastBox = ({
  type,
  description,
  title,
  t,
  iconName
}) => {
  const bg = React.useMemo(() => {
    switch (type) {
      case 'negative':
        return 'bg-red-primary';
      case 'positive':
        return 'bg-green-primary';
      default:
        return '';
    }
  }, [type]);
  const icon = React.useMemo(() => {
    if (iconName) return iconName;
    switch (type) {
      case 'negative':
        return 'WarningTriangleFill';
      case 'positive':
        return 'CircleCheck';
      default:
        return 'CircleCheck';
    }
  }, [type]);
  return jsxRuntime.jsxs("div", Object.assign({
    className: `rounded ${bg} px-5 py-4 flex items-center text-white gap-4`
  }, {
    children: [jsxRuntime.jsx(Icon.Icon, {
      name: icon,
      size: 24
    }), jsxRuntime.jsxs("div", Object.assign({
      className: "flex-1 min-w-[300px]"
    }, {
      children: [title && jsxRuntime.jsx("p", Object.assign({
        className: "font-16-bold"
      }, {
        children: title
      })), description && jsxRuntime.jsx("p", Object.assign({
        className: "font-14-regular mt-1"
      }, {
        children: description
      }))]
    })), jsxRuntime.jsx(Icon.Icon, {
      className: "cursor-pointer",
      name: "Close",
      size: 24,
      onClick: () => reactHotToast.toast.remove(t.id)
    })]
  }));
};

exports.ToastBox = ToastBox;
