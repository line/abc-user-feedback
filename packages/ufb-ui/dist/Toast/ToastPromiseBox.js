'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var reactHotToast = require('react-hot-toast');
var Icon = require('../Icon/Icon.js');

const ToastPromiseBox = ({
  title,
  t,
  closeable,
  status,
  description,
  theme
}) => {
  const {
    iconName,
    color
  } = React.useMemo(() => {
    switch (status) {
      case 'loading':
        return {
          iconName: theme === 'dark' ? 'LoadingDark' : 'LoadingLight',
          color: ''
        };
      case 'success':
        return {
          iconName: 'CircleCheck',
          color: 'text-green-primary'
        };
      case 'error':
        return {
          iconName: 'WarningCircleFill',
          color: 'text-red-primary'
        };
      default:
        return {
          iconName: 'CircleCheck',
          color: 'text-green-primary'
        };
    }
  }, [status]);
  return jsxRuntime.jsxs("div", Object.assign({
    className: "rounded px-5 py-4 flex items-center gap-4 bg-tertiary border border-fill-secondary "
  }, {
    children: [jsxRuntime.jsx(Icon.Icon, {
      name: iconName,
      size: 24,
      className: [color, status === 'loading' ? 'animate-spin' : ''].join(' ')
    }), jsxRuntime.jsxs("div", Object.assign({
      className: "flex-1 min-w-[300px]"
    }, {
      children: [jsxRuntime.jsx("p", Object.assign({
        className: "font-16-bold"
      }, {
        children: title
      })), description && jsxRuntime.jsx("p", Object.assign({
        className: "font-14-regular mt-1"
      }, {
        children: description
      }))]
    })), closeable && jsxRuntime.jsx(Icon.Icon, {
      className: "cursor-pointer",
      name: "Close",
      size: 24,
      onClick: () => reactHotToast.toast.remove(t.id)
    })]
  }));
};

exports.ToastPromiseBox = ToastPromiseBox;
