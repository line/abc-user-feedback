'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('@floating-ui/react');
var React = require('react');
var Icon = require('../Icon/Icon.js');

const Dialog = props => {
  const {
    title,
    description,
    children,
    open,
    close,
    icon,
    bottomButtons
  } = props;
  const {
    refs,
    context
  } = react.useFloating({
    open,
    onOpenChange(open) {
      if (!open) close();
    }
  });
  const click = react.useClick(context);
  const dismiss = react.useDismiss(context, {
    outsidePressEvent: 'mousedown'
  });
  const role = react.useRole(context);
  const {
    getFloatingProps
  } = react.useInteractions([click, dismiss, role]);
  const labelId = React.useId();
  const descriptionId = React.useId();
  return jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: open && jsxRuntime.jsx(react.FloatingPortal, {
      children: jsxRuntime.jsx(react.FloatingOverlay, Object.assign({
        lockScroll: true,
        className: "bg-dim",
        style: {
          display: 'grid',
          placeItems: 'center',
          zIndex: 20
        }
      }, {
        children: jsxRuntime.jsx(react.FloatingFocusManager, Object.assign({
          context: context
        }, {
          children: jsxRuntime.jsxs("div", Object.assign({
            ref: refs.setFloating,
            "aria-labelledby": labelId,
            "aria-describedby": descriptionId
          }, getFloatingProps(), {
            className: "bg-primary rounded p-5 min-w-[480px] border"
          }, {
            children: [jsxRuntime.jsx("h1", Object.assign({
              id: labelId,
              className: "font-20-bold mb-4"
            }, {
              children: title
            })), icon && jsxRuntime.jsx("div", Object.assign({
              className: "text-center mb-6"
            }, {
              children: jsxRuntime.jsx(Icon.Icon, Object.assign({}, icon))
            })), description && jsxRuntime.jsx("p", Object.assign({
              id: descriptionId,
              className: ['font-14-regular mb-10 whitespace-pre-line', icon ? 'text-center' : ''].join(' ')
            }, {
              children: description
            })), jsxRuntime.jsx("div", Object.assign({
              className: "mb-5"
            }, {
              children: children
            })), bottomButtons && jsxRuntime.jsx("div", Object.assign({
              className: "flex justify-end gap-2"
            }, {
              children: bottomButtons.map(button => jsxRuntime.jsx("button", Object.assign({}, button)))
            }))]
          }))
        }))
      }))
    })
  });
};

exports.Dialog = Dialog;
