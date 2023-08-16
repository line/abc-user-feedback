'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

const Input = React.forwardRef((props, ref) => {
  const {
      hint,
      label,
      isValid,
      isSubmitted,
      isSubmitting,
      leftChildren,
      rightChildren,
      className,
      size = 'md'
    } = props,
    rest = tslib_es6.__rest(props, ["hint", "label", "isValid", "isSubmitted", "isSubmitting", "leftChildren", "rightChildren", "className", "size"]);
  const {
    inputCN,
    hintCN
  } = React.useMemo(() => {
    if (isSubmitting) return {
      inputCN: '',
      hintCN: ''
    };
    if (!isSubmitted) return {
      inputCN: '',
      hintCN: ''
    };
    if (typeof isValid === 'undefined') return {
      inputCN: '',
      hintCN: ''
    };
    if (isValid) return {
      inputCN: 'input-success',
      hintCN: 'input-hint-success'
    };else return {
      inputCN: 'input-error',
      hintCN: 'input-hint-error'
    };
  }, [isValid, isSubmitted, isSubmitting]);
  const sizeCN = React.useMemo(() => {
    switch (size) {
      case 'lg':
        return 'input-lg';
      case 'md':
        return 'input-md';
      case 'sm':
        return 'input-sm';
      default:
        return 'input-md';
    }
  }, [size]);
  return jsxRuntime.jsxs("div", Object.assign({
    className: "flex flex-col gap-2"
  }, {
    children: [label && jsxRuntime.jsxs("label", Object.assign({
      htmlFor: label,
      className: "input-label"
    }, {
      children: [label, ' ', props.required && jsxRuntime.jsx("span", Object.assign({
        className: "text-red-primary"
      }, {
        children: "*"
      }))]
    })), jsxRuntime.jsxs("div", Object.assign({
      className: "relative"
    }, {
      children: [jsxRuntime.jsx("input", Object.assign({
        id: label,
        className: ['input', inputCN, sizeCN, className].join(' '),
        ref: ref
      }, rest)), leftChildren && jsxRuntime.jsx("div", Object.assign({
        className: "absolute absolute-y-center left-[14px] flex gap-2 items-center"
      }, {
        children: leftChildren
      })), rightChildren && jsxRuntime.jsx("div", Object.assign({
        className: "absolute absolute-y-center right-[14px] flex gap-2 items-center"
      }, {
        children: rightChildren
      }))]
    })), hint && jsxRuntime.jsx("span", Object.assign({
      className: `input-hint ${hintCN}`
    }, {
      children: hint
    }))]
  }));
});
Input.displayName = 'Input';

exports.Input = Input;
