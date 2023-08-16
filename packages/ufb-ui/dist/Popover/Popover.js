'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var jsxRuntime = require('react/jsx-runtime');
var react = require('@floating-ui/react');
var React = require('react');
var Icon = require('../Icon/Icon.js');

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

function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React__namespace.useState(initialOpen);
  const [labelId, setLabelId] = React__namespace.useState();
  const [descriptionId, setDescriptionId] = React__namespace.useState();
  const open = controlledOpen !== null && controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen !== null && setControlledOpen !== void 0 ? setControlledOpen : setUncontrolledOpen;
  const data = react.useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: react.autoUpdate,
    middleware: [react.offset(6), react.flip({
      crossAxis: placement.includes('-'),
      fallbackAxisSideDirection: 'end',
      padding: 5
    }), react.shift({
      padding: 6
    })]
  });
  const context = data.context;
  const click = react.useClick(context, {
    enabled: controlledOpen == null
  });
  const dismiss = react.useDismiss(context);
  const role = react.useRole(context);
  const interactions = react.useInteractions([click, dismiss, role]);
  return React__namespace.useMemo(() => Object.assign(Object.assign(Object.assign({
    open,
    setOpen
  }, interactions), data), {
    modal,
    labelId,
    descriptionId,
    setLabelId,
    setDescriptionId
  }), [open, setOpen, interactions, data, modal, labelId, descriptionId]);
}
const PopoverContext = React__namespace.createContext(null);
const usePopoverContext = () => {
  const context = React__namespace.useContext(PopoverContext);
  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }
  return context;
};
function Popover(_a) {
  var {
      children,
      modal = false
    } = _a,
    restOptions = tslib_es6.__rest(_a, ["children", "modal"]);
  const popover = usePopover(Object.assign({
    modal
  }, restOptions));
  return jsxRuntime.jsx(PopoverContext.Provider, Object.assign({
    value: popover
  }, {
    children: children
  }));
}
const PopoverTrigger = React__namespace.forwardRef(function PopoverTrigger(_a, propRef) {
  var {
      children,
      asChild = false
    } = _a,
    props = tslib_es6.__rest(_a, ["children", "asChild"]);
  const context = usePopoverContext();
  const childrenRef = children.ref;
  const ref = react.useMergeRefs([context.refs.setReference, propRef, childrenRef]);
  if (asChild && React__namespace.isValidElement(children)) {
    return React__namespace.cloneElement(children, context.getReferenceProps(Object.assign(Object.assign(Object.assign({
      ref
    }, props), children.props), {
      'data-state': context.open ? 'open' : 'closed'
    })));
  }
  return jsxRuntime.jsx("button", Object.assign({
    ref: ref,
    type: "button",
    "data-state": context.open ? 'open' : 'closed'
  }, context.getReferenceProps(props), {
    children: children
  }));
});
const PopoverContent = React__namespace.forwardRef(function PopoverContent(_a, propRef) {
  var {
      style,
      isPortal = false,
      disabledFloatingStyle = false
    } = _a,
    props = tslib_es6.__rest(_a, ["style", "isPortal", "disabledFloatingStyle"]);
  const _b = usePopoverContext(),
    {
      context: floatingContext
    } = _b,
    context = tslib_es6.__rest(_b, ["context"]);
  const ref = react.useMergeRefs([context.refs.setFloating, propRef]);
  if (!floatingContext.open) return null;
  const child = jsxRuntime.jsx(react.FloatingFocusManager, Object.assign({
    context: floatingContext,
    modal: context.modal
  }, {
    children: jsxRuntime.jsx("div", Object.assign({
      ref: ref,
      style: Object.assign(Object.assign(Object.assign({}, context.modal || disabledFloatingStyle ? {
        position: 'absolute'
      } : context.floatingStyles), {
        zIndex: 20
      }), style),
      "aria-labelledby": context.labelId,
      "aria-describedby": context.descriptionId
    }, context.getFloatingProps(props), {
      className: ['border rounded bg-primary border-fill-secondary shadow-sm', context.getFloatingProps(props).className].join(' ')
    }, {
      children: props.children
    }))
  }));
  const modalChild = context.modal ? jsxRuntime.jsx(react.FloatingOverlay, Object.assign({
    lockScroll: context.modal,
    className: "bg-dim",
    style: {
      display: 'grid',
      placeItems: 'center',
      zIndex: 20
    }
  }, {
    children: child
  })) : child;
  return isPortal ? jsxRuntime.jsx(react.FloatingPortal, {
    children: modalChild
  }) : modalChild;
});
const PopoverHeading = React__namespace.forwardRef(function PopoverHeading(props, ref) {
  const {
    setLabelId,
    setOpen
  } = usePopoverContext();
  const id = react.useId();
  React__namespace.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);
  return jsxRuntime.jsxs("div", Object.assign({
    className: "flex justify-between m-5"
  }, props, {
    ref: ref,
    id: id
  }, {
    children: [jsxRuntime.jsx("h1", Object.assign({
      className: "font-16-bold"
    }, {
      children: props.children
    })), jsxRuntime.jsx("button", Object.assign({
      className: "icon-btn icon-btn-tertiary icon-btn-xs",
      onClick: () => setOpen(false)
    }, {
      children: jsxRuntime.jsx(Icon.Icon, {
        name: "Close"
      })
    }))]
  }));
});

exports.Popover = Popover;
exports.PopoverContent = PopoverContent;
exports.PopoverHeading = PopoverHeading;
exports.PopoverTrigger = PopoverTrigger;
exports.usePopover = usePopover;
exports.usePopoverContext = usePopoverContext;
