'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var Icon = require('../Icon/Icon.js');
var Input = require('./Input.js');

const TextInput = React.forwardRef((props, ref) => {
  const {
      isSubmitted,
      isSubmitting,
      isValid,
      leftIconName,
      className,
      onChange,
      rightChildren
    } = props,
    rest = tslib_es6.__rest(props, ["isSubmitted", "isSubmitting", "isValid", "leftIconName", "className", "onChange", "rightChildren"]);
  const [iconType, setIconType] = React.useState();
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => inputRef.current);
  const onClickClear = React.useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    setIconType(undefined);
  }, [inputRef]);
  React.useEffect(() => {
    if (isSubmitting || !isSubmitted) return;
    setIconType(isValid ? 'success' : 'fail');
  }, [isSubmitted, isValid, isSubmitting]);
  return jsxRuntime.jsx(Input.Input, Object.assign({
    leftChildren: leftIconName && jsxRuntime.jsx(Icon.Icon, {
      size: props.size === 'sm' ? 16 : 20,
      name: leftIconName,
      className: "text-tertiary"
    }),
    rightChildren: jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [!rest.disabled && (iconType === 'clear' ? jsxRuntime.jsx("button", Object.assign({
        type: "button",
        onClick: onClickClear,
        disabled: rest.disabled
      }, {
        children: jsxRuntime.jsx(Icon.Icon, {
          size: props.size === 'sm' ? 16 : 20,
          className: "text-secondary",
          name: "CloseCircleFill"
        })
      })) : iconType === 'success' ? jsxRuntime.jsx(Icon.Icon, {
        size: props.size === 'sm' ? 16 : 20,
        name: "CircleCheck",
        className: "text-blue-primary"
      }) : iconType === 'fail' ? jsxRuntime.jsx(Icon.Icon, {
        size: props.size === 'sm' ? 16 : 20,
        name: "WarningCircleFill",
        className: "text-red-primary"
      }) : jsxRuntime.jsx(jsxRuntime.Fragment, {})), rightChildren]
    }),
    className: `${leftIconName ? 'pl-10' : ''} pr-10 ${className !== null && className !== void 0 ? className : ''}`,
    onChange: e => {
      const {
        value
      } = e.currentTarget;
      if (value.length === 0) setIconType(undefined);else setIconType('clear');
      if (onChange) onChange(e);
    },
    ref: inputRef,
    isSubmitted: isSubmitted,
    isSubmitting: isSubmitting,
    isValid: isValid
  }, rest));
});
TextInput.displayName = 'TextInput';

exports.TextInput = TextInput;
