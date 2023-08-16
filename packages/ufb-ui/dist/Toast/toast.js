'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var jsxRuntime = require('react/jsx-runtime');
var reactHotToast = require('react-hot-toast');
var ToastBox = require('./ToastBox.js');
var ToastPromiseBox = require('./ToastPromiseBox.js');

const toast = {
  positive: input => reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastBox.ToastBox, Object.assign({
    type: "positive"
  }, input, {
    t: t
  }))),
  negative: input => reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastBox.ToastBox, Object.assign({
    type: "negative"
  }, input, {
    t: t
  }))),
  promise: (fn, input, theme = 'light', option) => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    const {
      title,
      description
    } = input;
    const id = reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox.ToastPromiseBox, Object.assign({}, option, {
      t: t,
      status: "loading",
      title: title.loading,
      description: description === null || description === void 0 ? void 0 : description.loading,
      theme: theme
    })), {
      duration: Infinity
    });
    fn.then(() => {
      reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox.ToastPromiseBox, Object.assign({}, option, {
        t: t,
        status: "success",
        title: title.success,
        description: description === null || description === void 0 ? void 0 : description.success,
        theme: theme,
        closeable: true
      })), {
        id,
        duration: 4000
      });
    }).catch(() => {
      reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox.ToastPromiseBox, Object.assign({}, option, {
        t: t,
        status: "error",
        title: title.error,
        description: description === null || description === void 0 ? void 0 : description.error,
        theme: theme,
        closeable: true
      })), {
        id,
        duration: 4000
      });
    });
    return fn;
  })
};
const Toaster = () => jsxRuntime.jsx(reactHotToast.Toaster, {
  position: "bottom-center"
});

exports.Toaster = Toaster;
exports.toast = toast;
