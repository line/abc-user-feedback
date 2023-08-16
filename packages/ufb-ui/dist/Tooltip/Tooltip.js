'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('@floating-ui/react');
var React = require('react');

const Tooltip = ({
  children,
  title,
  place = 'bottom'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef(null);
  const {
    refs,
    floatingStyles,
    context
  } = react.useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [react.offset(10), react.flip(), react.shift(), react.arrow({
      element: arrowRef
    })],
    whileElementsMounted: react.autoUpdate,
    placement: place
  });
  const hover = react.useHover(context, {
    move: false
  });
  const focus = react.useFocus(context);
  const dismiss = react.useDismiss(context);
  const role = react.useRole(context, {
    role: 'tooltip'
  });
  const {
    getReferenceProps,
    getFloatingProps
  } = react.useInteractions([hover, focus, dismiss, role]);
  return jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [React.cloneElement(children, Object.assign({
      ref: refs.setReference
    }, getReferenceProps())), isOpen && jsxRuntime.jsxs("div", Object.assign({
      ref: refs.setFloating,
      style: floatingStyles,
      className: "bg-fill-primary px-4 py-2.5 font-12-regular text-inverse rounded"
    }, getFloatingProps(), {
      children: [title, jsxRuntime.jsx(react.FloatingArrow, {
        ref: arrowRef,
        context: context
      })]
    }))]
  });
};

exports.Tooltip = Tooltip;
