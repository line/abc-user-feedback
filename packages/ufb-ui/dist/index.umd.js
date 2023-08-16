(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react/jsx-runtime'), require('react-hot-toast'), require('@floating-ui/react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react/jsx-runtime', 'react-hot-toast', '@floating-ui/react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@ufb/ui"] = {}, global.React, global.jsxRuntime, global.reactHotToast, global.react));
})(this, (function (exports, React, jsxRuntime, reactHotToast, react) { 'use strict';

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

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    var _path$2u;
    function _extends$2M() { _extends$2M = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2M.apply(this, arguments); }
    var SvgTitle = function SvgTitle(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2M({
        width: "1em",
        height: "1em",
        viewBox: "0 0 123 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2u || (_path$2u = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.637 19.027a6.952 6.952 0 0 1-1.886-.265 5.134 5.134 0 0 1-1.688-.877c-.508-.408-.916-.943-1.225-1.605-.297-.662-.446-1.473-.446-2.433V6.915c0-.176.082-.264.248-.264H5.22c.166 0 .248.088.248.264v6.321c0 .96.199 1.666.596 2.118.408.453.932.679 1.572.679.629 0 1.142-.226 1.539-.679.408-.452.612-1.158.612-2.118v-6.32c0-.177.088-.265.265-.265h2.565c.176 0 .264.088.264.264v6.934c0 .96-.154 1.77-.463 2.432-.298.662-.7 1.197-1.208 1.605a5.107 5.107 0 0 1-1.704.877 6.776 6.776 0 0 1-1.87.265ZM18.237 18.96c-.993 0-1.826-.198-2.499-.595a3.314 3.314 0 0 1-1.44-1.704c-.066-.166-.005-.265.182-.298l1.986-.414c.143-.033.254.017.331.149.154.242.348.42.58.53.23.11.485.165.76.165.254 0 .458-.039.613-.116.154-.077.231-.193.231-.348 0-.12-.066-.231-.198-.33-.122-.1-.364-.199-.728-.298l-.331-.083c-1.137-.298-1.936-.712-2.4-1.241-.452-.54-.678-1.147-.678-1.82 0-.53.149-.998.447-1.407.309-.408.733-.728 1.274-.96.551-.231 1.18-.347 1.886-.347.938 0 1.704.182 2.3.546.607.353 1.048.905 1.324 1.655.066.176.006.281-.182.314l-1.92.447c-.143.033-.248-.022-.314-.165a1.206 1.206 0 0 0-.447-.464c-.165-.11-.38-.165-.645-.165a.973.973 0 0 0-.496.116.342.342 0 0 0-.199.33c0 .276.326.497.976.662l.315.083c1.158.287 1.958.668 2.399 1.142.441.474.662 1.087.662 1.837 0 .562-.166 1.053-.497 1.472-.32.408-.766.728-1.34.96-.562.232-1.213.348-1.952.348ZM27.468 18.96c-.927 0-1.738-.193-2.433-.579a4.156 4.156 0 0 1-1.605-1.605c-.375-.695-.563-1.489-.563-2.383 0-.893.188-1.682.563-2.366a4.157 4.157 0 0 1 1.605-1.605c.695-.386 1.506-.579 2.433-.579.981 0 1.803.215 2.465.645a3.857 3.857 0 0 1 1.473 1.787c.33.75.469 1.628.413 2.631-.01.166-.104.249-.28.249h-5.66c.22.893.756 1.34 1.605 1.34.662 0 1.147-.21 1.456-.629.1-.11.215-.149.348-.116l2.118.712c.165.077.21.193.132.347-.408.75-.982 1.297-1.72 1.639a5.457 5.457 0 0 1-2.35.512Zm-.034-6.784c-.849 0-1.367.453-1.555 1.357h3.012c-.177-.904-.662-1.357-1.456-1.357ZM33.5 18.795c-.176 0-.264-.088-.264-.265v-8.273c0-.166.088-.248.265-.248h2.068c.188 0 .281.082.281.248l.05.893a2.611 2.611 0 0 1 1.125-.96 3.581 3.581 0 0 1 1.787-.28c.11.01.21.027.298.049.155.055.232.154.232.298v2.267c0 .176-.1.248-.298.215a3.224 3.224 0 0 0-.38-.05 2.847 2.847 0 0 0-.464-.033c-.287 0-.585.066-.893.199-.31.121-.569.32-.778.595-.21.276-.315.63-.315 1.06v4.02c0 .177-.088.265-.264.265H33.5ZM41.02 18.795c-.177 0-.265-.088-.265-.265V6.914c0-.176.088-.264.265-.264h7.727c.177 0 .265.088.265.264v2.234c0 .166-.088.248-.265.248H43.85v2.333h4.104c.176 0 .265.089.265.265v2.234c0 .165-.089.248-.265.248h-4.104v4.054c0 .177-.088.265-.264.265H41.02ZM54.13 18.96c-.926 0-1.737-.193-2.432-.579a4.156 4.156 0 0 1-1.605-1.605c-.375-.695-.563-1.489-.563-2.383 0-.893.188-1.682.563-2.366a4.157 4.157 0 0 1 1.605-1.605c.695-.386 1.506-.579 2.432-.579.982 0 1.804.215 2.466.645a3.856 3.856 0 0 1 1.472 1.787c.331.75.47 1.628.414 2.631-.01.166-.105.249-.281.249h-5.66c.221.893.756 1.34 1.606 1.34.662 0 1.147-.21 1.456-.629.1-.11.215-.149.347-.116l2.118.712c.166.077.21.193.133.347-.408.75-.982 1.297-1.721 1.639a5.457 5.457 0 0 1-2.35.512Zm-.033-6.784c-.85 0-1.368.453-1.555 1.357h3.011c-.176-.904-.662-1.357-1.456-1.357ZM64.052 18.96c-.927 0-1.738-.193-2.433-.579a4.156 4.156 0 0 1-1.605-1.605c-.375-.695-.562-1.489-.562-2.383 0-.893.187-1.682.563-2.366a4.157 4.157 0 0 1 1.605-1.605c.695-.386 1.505-.579 2.432-.579.982 0 1.804.215 2.465.645a3.857 3.857 0 0 1 1.473 1.787c.331.75.469 1.628.414 2.631-.011.166-.105.249-.281.249h-5.66c.221.893.756 1.34 1.605 1.34.662 0 1.148-.21 1.457-.629.099-.11.215-.149.347-.116l2.118.712c.166.077.21.193.133.347-.409.75-.982 1.297-1.721 1.639a5.457 5.457 0 0 1-2.35.512Zm-.033-6.784c-.85 0-1.368.453-1.556 1.357h3.012c-.176-.904-.662-1.357-1.456-1.357ZM73.46 18.96c-.816 0-1.533-.187-2.15-.562a3.95 3.95 0 0 1-1.423-1.605c-.342-.695-.513-1.495-.513-2.4 0-.915.17-1.71.513-2.382.342-.684.816-1.214 1.423-1.589.617-.386 1.334-.579 2.15-.579.916 0 1.683.281 2.3.844V6.65c0-.177.089-.265.265-.265h2.45c.176 0 .264.088.264.265v11.88c0 .177-.088.265-.264.265H76.39c-.177 0-.265-.088-.265-.265l-.033-.777c-.64.805-1.517 1.207-2.631 1.207Zm.729-2.614c.54 0 .976-.182 1.307-.546.331-.364.496-.833.496-1.407 0-.573-.165-1.036-.496-1.39-.33-.364-.767-.546-1.307-.546-.54 0-.976.182-1.307.547-.331.353-.497.816-.497 1.39 0 .573.166 1.042.497 1.406.33.364.766.546 1.307.546ZM85.942 18.96c-1.114 0-1.991-.402-2.631-1.207l-.033.777c0 .177-.094.265-.282.265h-2.068c-.177 0-.265-.088-.265-.265V6.65c0-.177.088-.265.265-.265h2.449c.176 0 .265.088.265.265v4.037c.617-.563 1.384-.844 2.3-.844.816 0 1.528.193 2.134.58a3.798 3.798 0 0 1 1.44 1.588c.342.673.513 1.467.513 2.383 0 .904-.171 1.704-.513 2.399a3.91 3.91 0 0 1-1.44 1.605c-.606.375-1.318.563-2.134.563Zm-.728-2.614c.54 0 .976-.182 1.307-.546.33-.364.496-.833.496-1.407 0-.573-.165-1.036-.496-1.39-.331-.364-.767-.546-1.307-.546-.54 0-.977.182-1.308.547-.33.353-.496.816-.496 1.39 0 .573.166 1.042.496 1.406.331.364.767.546 1.308.546ZM95.146 18.96c-.816 0-1.533-.187-2.15-.562a3.949 3.949 0 0 1-1.424-1.605c-.342-.695-.513-1.495-.513-2.4 0-.915.171-1.71.513-2.382.342-.684.816-1.214 1.423-1.589.618-.386 1.335-.579 2.151-.579.552 0 1.048.105 1.49.315.452.198.833.49 1.141.877l.033-.778c0-.166.089-.248.265-.248h2.085c.177 0 .265.082.265.248v8.273c0 .177-.088.265-.265.265h-2.085c-.176 0-.265-.088-.265-.265l-.033-.777c-.64.805-1.517 1.207-2.63 1.207Zm.728-2.614c.541 0 .977-.182 1.308-.546.33-.364.496-.833.496-1.407 0-.573-.165-1.036-.496-1.39-.331-.364-.767-.546-1.308-.546-.54 0-.976.182-1.307.547-.33.353-.496.816-.496 1.39 0 .573.165 1.042.496 1.406.331.364.767.546 1.307.546ZM106.453 18.96c-.927 0-1.732-.193-2.416-.579a4.042 4.042 0 0 1-1.589-1.605c-.364-.684-.546-1.478-.546-2.383 0-.904.182-1.693.546-2.366a4.043 4.043 0 0 1 1.589-1.605c.684-.386 1.489-.579 2.416-.579.981 0 1.842.215 2.581.645.75.42 1.285 1.104 1.605 2.052.055.188-.006.298-.182.331l-2.052.58c-.154.032-.27-.023-.347-.166a1.5 1.5 0 0 0-.596-.629 1.735 1.735 0 0 0-.844-.199c-.563 0-.987.188-1.274.563-.276.364-.414.822-.414 1.373 0 .541.138 1.004.414 1.39.287.376.711.563 1.274.563.309 0 .59-.066.844-.198.254-.144.452-.37.596-.679.088-.154.198-.215.331-.182l2.233.563c.188.033.243.143.166.33-.342.938-.905 1.639-1.688 2.102-.772.452-1.655.678-2.647.678ZM112.438 18.795c-.176 0-.264-.088-.264-.265V6.65c0-.177.088-.265.264-.265h2.449c.177 0 .265.088.265.265v6.304l2.449-2.796a.407.407 0 0 1 .314-.15h2.896c.11 0 .182.034.215.1.033.055.006.127-.082.215l-2.615 2.714 2.962 5.444c.055.088.066.165.033.231-.033.055-.105.083-.215.083h-2.747a.333.333 0 0 1-.314-.182l-1.804-3.409-1.092 1.125v2.201c0 .177-.088.265-.265.265h-2.449Z"
      })));
    };

    var _path$2t;
    function _extends$2L() { _extends$2L = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2L.apply(this, arguments); }
    var SvgBagFill = function SvgBagFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2L({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2t || (_path$2t = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M16.492 6.228C16.26 3.914 14.517 2 12 2S7.74 3.914 7.508 6.228h-.862a2.949 2.949 0 0 0-2.942 2.753l-.697 10.181a2.949 2.949 0 0 0 2.942 3.145H18.05a2.948 2.948 0 0 0 2.942-3.145l-.697-10.181a2.948 2.948 0 0 0-2.942-2.753h-.862Zm-7.068 0C9.634 4.85 10.667 3.902 12 3.902s2.366.948 2.576 2.326H9.424Zm-1.916 0h1.916c-.026.17-.04.346-.04.528v3.09a.951.951 0 1 1-1.902 0v-3.09c0-.178.009-.354.026-.528Zm8.984 0h-1.916c.026.17.04.346.04.528v3.09a.951.951 0 0 0 1.902 0v-3.09c0-.178-.009-.354-.026-.528Z"
      })));
    };

    var _path$2s;
    function _extends$2K() { _extends$2K = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2K.apply(this, arguments); }
    var SvgBellFill = function SvgBellFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2K({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2s || (_path$2s = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.948 3.048a.947.947 0 1 0-1.895 0v.72a6.632 6.632 0 0 0-6.269 6.24l-.263 4.55a6.631 6.631 0 0 1-.799 2.793l-.606 1.112a.947.947 0 0 0 .831 1.4h16.106a.947.947 0 0 0 .831-1.4l-.606-1.112a6.63 6.63 0 0 1-.799-2.793l-.263-4.55a6.632 6.632 0 0 0-6.268-6.24v-.72ZM10.105 20.759a1 1 0 1 0 0 2h3.79a1 1 0 1 0 0-2h-3.79Z"
      })));
    };

    var _path$2r;
    function _extends$2J() { _extends$2J = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2J.apply(this, arguments); }
    var SvgBikeFill = function SvgBikeFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2J({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2r || (_path$2r = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5.369 21.098a3.886 3.886 0 0 1-3.612-5.325l-.474-1.54a2.939 2.939 0 0 1 .204-2.223l1.688-3.235h-.65a1.043 1.043 0 1 1 0-2.086h7.109a1.043 1.043 0 0 1 0 2.086h-.379v1.706h3.196l2.123-2.654h-.2a1.043 1.043 0 1 1 0-2.085H15.7v-.948c0-1.1.891-1.991 1.99-1.991h3.792c.576 0 1.043.467 1.043 1.043v2.938c0 .576-.467 1.043-1.043 1.043h-3.052l2.749 5.498h.777c.576 0 1.043.467 1.043 1.043v.948c0 .575-.467 1.042-1.043 1.042h-.473a3.886 3.886 0 0 1-7.538 1.896H9.115a3.888 3.888 0 0 1-3.745 2.844Zm0-5.688a1.801 1.801 0 1 0 0 3.602 1.801 1.801 0 0 0 0-3.602Zm12.323 0a1.801 1.801 0 1 0 0 3.602 1.801 1.801 0 0 0 0-3.602Z"
      })));
    };

    var _path$2q;
    function _extends$2I() { _extends$2I = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2I.apply(this, arguments); }
    var SvgBookmarkFill = function SvgBookmarkFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2I({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2q || (_path$2q = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M3.21 4.63A2.93 2.93 0 0 1 6.14 1.7h11.718a2.93 2.93 0 0 1 2.93 2.93v15.947c0 1.476-1.574 2.418-2.875 1.721l-5.914-3.168-5.914 3.168c-1.3.697-2.875-.245-2.875-1.721V4.63Z"
      })));
    };

    var _path$2p;
    function _extends$2H() { _extends$2H = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2H.apply(this, arguments); }
    var SvgBubbleDotsFill = function SvgBubbleDotsFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2H({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2p || (_path$2p = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6.143 2.5a4.88 4.88 0 0 0-4.881 4.881v7.321a4.88 4.88 0 0 0 4.88 4.881h5.491l3.629 3.175a.976.976 0 0 0 1.581-.466l.774-2.709h.24a4.881 4.881 0 0 0 4.88-4.88V7.38a4.881 4.881 0 0 0-4.88-4.881H6.143ZM8 10a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 8 10Zm5.25 1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM16.006 10a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
      })));
    };

    var _path$2o;
    function _extends$2G() { _extends$2G = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2G.apply(this, arguments); }
    var SvgBubbleFill = function SvgBubbleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2G({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2o || (_path$2o = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M1.29 7.395a4.868 4.868 0 0 1 4.868-4.869h11.684a4.868 4.868 0 0 1 4.869 4.869v7.302a4.868 4.868 0 0 1-4.869 4.869h-.24l-.771 2.701a.974.974 0 0 1-1.577.466l-3.62-3.167H6.158a4.868 4.868 0 0 1-4.868-4.869V7.395Z"
      })));
    };

    var _path$2n;
    function _extends$2F() { _extends$2F = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2F.apply(this, arguments); }
    var SvgBycicleFill = function SvgBycicleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2F({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2n || (_path$2n = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5.513 12.325a4.263 4.263 0 1 0 4.214 4.911h1.81c.397 0 .759-.231.925-.592l2.774-6.01.282-.564.925 2.776a4.263 4.263 0 1 0 1.976-.52L17.12 8.431h1.134a2.641 2.641 0 1 0 0-5.282h-3.011a1.02 1.02 0 1 0 0 2.039h3.011a.602.602 0 1 1 0 1.205h-2.548c-.386 0-.74.218-.912.563l-1.108 2.217H9.449l-.714-1.529h.717a1.02 1.02 0 0 0 0-2.039H4.818a1.02 1.02 0 1 0 0 2.039h1.667l1.16 2.485-1.172 2.303a4.281 4.281 0 0 0-.96-.108Zm-2.224 4.263a2.224 2.224 0 1 1 4.448 0 2.224 2.224 0 0 1-4.448 0Zm12.974 0a2.224 2.224 0 1 1 4.448 0 2.224 2.224 0 0 1-4.448 0Z"
      })));
    };

    var _path$2m, _path2$G;
    function _extends$2E() { _extends$2E = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2E.apply(this, arguments); }
    var SvgCalendarAFill = function SvgCalendarAFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2E({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2m || (_path$2m = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M8.1 2c.539 0 .976.437.976.976v1.463h5.853V2.976a.976.976 0 0 1 1.951 0v1.463h1.951a2.927 2.927 0 0 1 2.927 2.927v1.462H2.247V7.366a2.927 2.927 0 0 1 2.926-2.927h1.952V2.976c0-.54.436-.976.975-.976Z"
      })), _path2$G || (_path2$G = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M21.758 19.073A2.927 2.927 0 0 1 18.831 22H5.173a2.927 2.927 0 0 1-2.926-2.927v-8.294h19.511v8.294Zm-7.538-.134a1.22 1.22 0 1 0 0-2.439 1.22 1.22 0 0 0 0 2.439Zm3.414 0a1.22 1.22 0 1 0 0-2.439 1.22 1.22 0 0 0 0 2.439Z"
      })));
    };

    var _path$2l, _path2$F;
    function _extends$2D() { _extends$2D = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2D.apply(this, arguments); }
    var SvgCalendarBFill = function SvgCalendarBFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2D({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2l || (_path$2l = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M2.5 5.35A2.85 2.85 0 0 1 5.35 2.5h13.3a2.85 2.85 0 0 1 2.85 2.85v1.425h-19V5.35Z"
      })), _path2$F || (_path2$F = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M21.5 18.65a2.85 2.85 0 0 1-2.85 2.85H5.35a2.85 2.85 0 0 1-2.85-2.85V8.675h19v9.975Zm-5.376-4.663a1.187 1.187 0 1 0 2.375 0 1.187 1.187 0 0 0-2.375 0Zm-2.138 4.512a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Zm3.325 0a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Zm-3.325-3.325a1.187 1.187 0 1 0 0-2.375 1.187 1.187 0 0 0 0 2.375Z"
      })));
    };

    var _path$2k;
    function _extends$2C() { _extends$2C = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2C.apply(this, arguments); }
    var SvgCallCircleFill = function SvgCallCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2C({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2k || (_path$2k = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1 8.456-.804.805.018.033c.125.23.405.64 1.129 1.363.723.724 1.13 1.002 1.361 1.127l.018.01.016.008.804-.804c.48-.48 1.269-.515 1.887-.086l.83.54c.819.569.991 1.694.356 2.329l-.695.695c-.688.687-1.815.626-2.889.232-1.104-.406-2.324-1.216-3.424-2.315-1.1-1.1-1.909-2.32-2.314-3.424-.395-1.074-.456-2.201.231-2.889l.695-.695c.635-.635 1.76-.463 2.33.357l.537.827c.43.618.394 1.408-.086 1.887Z"
      })));
    };

    var _path$2j;
    function _extends$2B() { _extends$2B = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2B.apply(this, arguments); }
    var SvgCallFill = function SvgCallFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2B({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2j || (_path$2j = /*#__PURE__*/React__namespace.createElement("path", {
        d: "m8.572 10.595 1.529-1.528c.91-.911.978-2.411.162-3.586L9.242 3.909C8.16 2.352 6.023 2.025 4.817 3.232l-1.32 1.32C2.19 5.86 2.305 8 3.055 10.041c.77 2.098 2.309 4.416 4.398 6.505 2.089 2.09 4.407 3.628 6.505 4.398 2.041.75 4.182.866 5.489-.44l1.32-1.32c1.207-1.207.88-3.344-.677-4.426l-1.575-1.024c-1.175-.817-2.675-.749-3.586.162l-1.528 1.528a4.123 4.123 0 0 1-.056-.03l-.008-.004c-.438-.238-1.212-.767-2.587-2.141-1.374-1.375-1.906-2.152-2.145-2.59l-.004-.009-.03-.055Z"
      })));
    };

    var _path$2i, _path2$E;
    function _extends$2A() { _extends$2A = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2A.apply(this, arguments); }
    var SvgCameraFill = function SvgCameraFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2A({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2i || (_path$2i = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.125 15.833a2.062 2.062 0 1 0 0-4.125 2.062 2.062 0 0 0 0 4.125Z"
      })), _path2$E || (_path2$E = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9.917 3a.917.917 0 0 0-.796.462L7.55 6.208H3.75A2.75 2.75 0 0 0 1 8.958v9.625a2.75 2.75 0 0 0 2.75 2.75h16a2.75 2.75 0 0 0 2.75-2.75V8.958a2.75 2.75 0 0 0-2.75-2.75h-1.051l-1.57-2.746A.917.917 0 0 0 16.333 3H9.917Zm3.208 6.875a3.896 3.896 0 1 1 0 7.791 3.896 3.896 0 0 1 0-7.791Zm-7.083.291a1.375 1.375 0 1 1-2.75 0 1.375 1.375 0 0 1 2.75 0Z"
      })));
    };

    var _path$2h;
    function _extends$2z() { _extends$2z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2z.apply(this, arguments); }
    var SvgCarFill = function SvgCarFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2z({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2h || (_path$2h = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5.092 3a2.75 2.75 0 0 0-2.46 1.52L.764 8.57a1.03 1.03 0 0 0-.108.517v6.662c0 .713.38 1.337.947 1.683a3.843 3.843 0 0 0 7.636.285h4.58a3.844 3.844 0 0 0 7.646-.563v-.023l1.55-1.459c.207-.195.325-.466.325-.75v-2.88c0-1.045-.56-2.009-1.468-2.526L18.9 8.136a1.03 1.03 0 0 0-.294-.112L15.92 4.355a3.609 3.609 0 0 0-2.818-1.354H5.092ZM3.355 8l1.123-2.558a.687.687 0 0 1 .614-.38h2.595V8H3.355Zm9.749-2.938c.47 0 .914.214 1.207.58L15.947 8H9.749V5.062h3.355ZM5.436 18.935a1.781 1.781 0 1 1 0-3.562 1.781 1.781 0 0 1 0 3.562Zm10.405-1.781a1.78 1.78 0 1 1 3.562 0 1.78 1.78 0 0 1-3.562 0Z"
      })));
    };

    var _path$2g, _path2$D;
    function _extends$2y() { _extends$2y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2y.apply(this, arguments); }
    var SvgChannelFill = function SvgChannelFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2y({
        width: "1em",
        height: "1em",
        viewBox: "0 0 12 12",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2g || (_path$2g = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.324 6.41h-.83l.188-.863h.836l-.194.863Z"
      })), _path2$D || (_path2$D = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.5 1A1.5 1.5 0 0 0 1 2.5v7A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 11 9.5v-7A1.5 1.5 0 0 0 9.5 1h-7Zm1.497 7.383c-.012.074.031.117.1.117h.836c.062 0 .106-.037.119-.099l.218-.992h.83l-.213.974c-.018.074.02.117.1.117h.83c.062 0 .1-.037.112-.099l.225-.992h.643c.062 0 .106-.037.118-.099l.175-.777c.012-.08-.031-.123-.106-.123h-.612l.194-.863h.648c.063 0 .1-.043.113-.099l.168-.783c.019-.074-.018-.117-.093-.117H7.79l.206-.93c.025-.075-.019-.118-.093-.118h-.836a.115.115 0 0 0-.119.092l-.218.956H5.9l.206-.93c.025-.075-.019-.118-.094-.118h-.83c-.068 0-.112.037-.124.092l-.212.956h-.643c-.056 0-.1.043-.112.099l-.169.783c-.018.074.019.117.1.117h.605l-.193.863H3.79c-.062 0-.1.037-.112.099l-.175.783c-.018.074.025.117.1.117h.612l-.219.974Z"
      })));
    };

    var _path$2f;
    function _extends$2x() { _extends$2x = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2x.apply(this, arguments); }
    var SvgCloseCircleFill = function SvgCloseCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2x({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2f || (_path$2f = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM9.461 8.175 12 10.715l2.539-2.54a.909.909 0 1 1 1.286 1.286L13.285 12l2.54 2.539a.909.909 0 1 1-1.286 1.286L12 13.285l-2.539 2.54a.909.909 0 1 1-1.286-1.286L10.715 12l-2.54-2.539a.91.91 0 0 1 1.286-1.286Z"
      })));
    };

    var _path$2e;
    function _extends$2w() { _extends$2w = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2w.apply(this, arguments); }
    var SvgCollectionFill = function SvgCollectionFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2w({
        width: "1em",
        height: "1em",
        viewBox: "0 0 12 12",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2e || (_path$2e = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M1.5 6.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1V9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V6.5ZM3.5 2.5A.5.5 0 0 1 4 2h4a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5ZM2.5 4.25c0-.345.28-.625.625-.625h5.75a.625.625 0 1 1 0 1.25h-5.75A.625.625 0 0 1 2.5 4.25Z"
      })));
    };

    var _path$2d, _path2$C;
    function _extends$2v() { _extends$2v = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2v.apply(this, arguments); }
    var SvgCopyFill = function SvgCopyFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2v({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2d || (_path$2d = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M8.667 5.333A3.333 3.333 0 0 1 12 2h6.667A3.333 3.333 0 0 1 22 5.333V12a3.333 3.333 0 0 1-3.333 3.333H12A3.333 3.333 0 0 1 8.667 12V5.333Z"
      })), _path2$C || (_path2$C = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M15.333 18.667A3.333 3.333 0 0 1 12 22H5.333A3.333 3.333 0 0 1 2 18.667V12a3.333 3.333 0 0 1 3.333-3.333h.865v4.691a4.444 4.444 0 0 0 4.444 4.444h4.691v.865Z"
      })));
    };

    var _path$2c;
    function _extends$2u() { _extends$2u = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2u.apply(this, arguments); }
    var SvgCreditcardFill = function SvgCreditcardFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2u({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2c || (_path$2c = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1 6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm20 4V8H3v2h18Z"
      })));
    };

    var _path$2b;
    function _extends$2t() { _extends$2t = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2t.apply(this, arguments); }
    var SvgDeleteFill = function SvgDeleteFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2t({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2b || (_path$2b = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7.837 3.25a2.98 2.98 0 0 0-2.528 1.401l-3.606 5.77a2.98 2.98 0 0 0 0 3.159l3.606 5.769a2.98 2.98 0 0 0 2.528 1.401H19.75a2.98 2.98 0 0 0 2.981-2.98V6.23a2.98 2.98 0 0 0-2.98-2.98H7.836Zm2.223 6.613a1.058 1.058 0 1 1 1.496-1.495l2.136 2.136 2.137-2.136a1.058 1.058 0 0 1 1.496 1.495L15.188 12l2.137 2.137a1.058 1.058 0 1 1-1.496 1.496l-2.137-2.137-2.136 2.137a1.058 1.058 0 0 1-1.496-1.496L12.196 12 10.06 9.863Z"
      })));
    };

    var _path$2a;
    function _extends$2s() { _extends$2s = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2s.apply(this, arguments); }
    var SvgDeliveryFill = function SvgDeliveryFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2s({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2a || (_path$2a = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.75 15.059v-2.142h-.917a.917.917 0 1 1 0-1.833h.917v1.832h6.417a.917.917 0 0 0 0-1.833H3.75V9.25H1.917a.917.917 0 1 1 0-1.834H3.75V9.25h3.667a.917.917 0 1 0 0-1.833H3.75V2.833H15.5a2 2 0 0 1 2 2v.333h2.933c.419 0 .784.284.888.689l1.65 5.917c.02.074.029.151.029.228v5.5c0 .506-.41.917-.917.917h-1.865a3.209 3.209 0 0 1-6.352 0H8.3a3.209 3.209 0 1 1-4.551-3.358Zm17.151-3.976L19.723 7H17.5v4.083h3.401ZM3.917 17.958a1.208 1.208 0 1 0 2.416 0 1.208 1.208 0 0 0-2.416 0Zm11.916 0a1.208 1.208 0 1 0 2.417 0 1.208 1.208 0 0 0-2.417 0Z"
      })));
    };

    var _path$29;
    function _extends$2r() { _extends$2r = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2r.apply(this, arguments); }
    var SvgDocumentFill = function SvgDocumentFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2r({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$29 || (_path$29 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6.34 2a2.925 2.925 0 0 0-2.925 2.925v15.094c0 1.094.887 1.981 1.981 1.981h13.208a1.981 1.981 0 0 0 1.98-1.981V4.925A2.925 2.925 0 0 0 17.66 2H6.34Zm2.594 7.264a1.038 1.038 0 1 1 0-2.075h6.132a1.038 1.038 0 0 1 0 2.075H8.934ZM7.896 12c0-.573.465-1.038 1.038-1.038h6.132a1.038 1.038 0 0 1 0 2.076H8.934A1.038 1.038 0 0 1 7.896 12Zm1.038 4.811a1.038 1.038 0 0 1 0-2.075h2.83a1.038 1.038 0 1 1 0 2.075h-2.83Z"
      })));
    };

    var _path$28;
    function _extends$2q() { _extends$2q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2q.apply(this, arguments); }
    var SvgDocumentInfoFill = function SvgDocumentInfoFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2q({
        width: "1em",
        height: "1em",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$28 || (_path$28 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 .833a2.5 2.5 0 0 0-2.5 2.5v13.334a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5V5.69a2.5 2.5 0 0 0-.732-1.767L14.41 1.565a2.5 2.5 0 0 0-1.768-.732H5Zm5 6.894a.947.947 0 1 1 0-1.894.947.947 0 0 1 0 1.894Zm.757 6.06a.758.758 0 0 1-1.515 0V9.243a.758.758 0 0 1 1.515 0v4.546Z"
      })));
    };

    var _path$27;
    function _extends$2p() { _extends$2p = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2p.apply(this, arguments); }
    var SvgDocumentTermsFill = function SvgDocumentTermsFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2p({
        width: "1em",
        height: "1em",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$27 || (_path$27 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 1.667c-.92 0-1.667.746-1.667 1.666v13.334c0 .92.746 1.666 1.667 1.666h10c.92 0 1.667-.746 1.667-1.666V5.345a.833.833 0 0 0-.245-.589l-2.845-2.845a.833.833 0 0 0-.589-.244H5Zm1.667 4.166a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834V6.667a.833.833 0 0 0-.834-.834H6.667Zm0 5a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834v-1.666a.833.833 0 0 0-.834-.834H6.667Zm4.166-4.166c0-.46.373-.834.834-.834h1.666c.46 0 .834.374.834.834v1.666c0 .46-.373.834-.834.834h-1.666a.833.833 0 0 1-.834-.834V6.667Zm.834 4.166a.833.833 0 0 0-.834.834v1.666c0 .46.373.834.834.834h1.666c.46 0 .834-.373.834-.834v-1.666a.833.833 0 0 0-.834-.834h-1.666Z"
      })));
    };

    var _path$26;
    function _extends$2o() { _extends$2o = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2o.apply(this, arguments); }
    var SvgDownCircleFill = function SvgDownCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2o({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$26 || (_path$26 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-3.825-8.448a.909.909 0 1 1 1.286-1.286l1.63 1.63V7.91a.91.91 0 1 1 1.818 0v5.987l1.63-1.63a.909.909 0 1 1 1.286 1.286l-3.182 3.182a.909.909 0 0 1-1.286 0l-3.182-3.182Z"
      })));
    };

    var _path$25;
    function _extends$2n() { _extends$2n = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2n.apply(this, arguments); }
    var SvgEditFill = function SvgEditFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2n({
        width: "1em",
        height: "1em",
        viewBox: "0 0 21 20",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$25 || (_path$25 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M19.284 1.625c1.086 1.086 1.016 2.916-.155 4.087L16.62 8.221l-4.584-4.585 2.509-2.508c1.171-1.171 3.001-1.241 4.087-.155l.652.652ZM10.622 5.05l-8.741 8.742a3.177 3.177 0 0 0-.827 1.427L.42 17.617c-.37 1.398.823 2.591 2.22 2.22l2.399-.634a3.178 3.178 0 0 0 1.427-.827l8.741-8.741-4.584-4.584Z"
      })));
    };

    var _path$24;
    function _extends$2m() { _extends$2m = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2m.apply(this, arguments); }
    var SvgExchangeCircleFill = function SvgExchangeCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2m({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$24 || (_path$24 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM8.364 7.91a.91.91 0 0 1 1.818 0v5.986l.266-.266a.91.91 0 1 1 1.286 1.286l-1.818 1.818a.91.91 0 0 1-1.286 0l-1.818-1.818a.91.91 0 0 1 1.285-1.286l.267.266V7.91Zm5.72-.644a.91.91 0 0 1 1.286 0l1.818 1.818a.91.91 0 0 1-1.285 1.286l-.267-.266v5.987a.91.91 0 1 1-1.818 0v-5.987l-.266.266a.91.91 0 1 1-1.286-1.286l1.818-1.818Z"
      })));
    };

    var _path$23;
    function _extends$2l() { _extends$2l = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2l.apply(this, arguments); }
    var SvgEyeFill = function SvgEyeFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2l({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$23 || (_path$23 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 3.92c-4.358 0-8.262 3.063-10.404 7.699a1.04 1.04 0 0 0 0 .873c2.142 4.636 6.046 7.698 10.403 7.698 4.359 0 8.263-3.062 10.405-7.698a1.04 1.04 0 0 0 0-.873C20.262 6.983 16.358 3.92 12 3.92Zm0 11.54a3.405 3.405 0 1 1 0-6.81 3.405 3.405 0 0 1 0 6.81Z"
      })));
    };

    var _path$22, _path2$B;
    function _extends$2k() { _extends$2k = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2k.apply(this, arguments); }
    var SvgEyeSlashFill = function SvgEyeSlashFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2k({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$22 || (_path$22 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M21.97 5a1.1 1.1 0 1 0-1.555-1.556L3.444 20.414A1.1 1.1 0 1 0 5 21.97l2.777-2.777a9.58 9.58 0 0 0 4.222.997c4.359 0 8.263-3.063 10.405-7.699a1.04 1.04 0 0 0 0-.872c-.748-1.62-1.711-3.047-2.834-4.22l2.4-2.4Zm-6.595 6.595a3.405 3.405 0 0 1-3.835 3.835l3.835-3.835Z"
      })), _path2$B || (_path2$B = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 8.65c.121 0 .242.006.36.019l3.788-3.788c-1.3-.622-2.7-.961-4.149-.961-4.357 0-8.261 3.063-10.403 7.699a1.04 1.04 0 0 0 0 .873c.736 1.593 1.68 3 2.78 4.161l4.237-4.238A3.405 3.405 0 0 1 12 8.65Z"
      })));
    };

    var _path$21;
    function _extends$2j() { _extends$2j = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2j.apply(this, arguments); }
    var SvgFilterCircleFill = function SvgFilterCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2j({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$21 || (_path$21 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.999 12c0-5.523 4.477-10 10-10 5.524 0 10 4.477 10 10s-4.476 10-10 10C6.476 22 2 17.523 2 12Zm6.397-3.694a.991.991 0 0 0 0 1.982h7.207a.991.991 0 0 0 0-1.982H8.396Zm.9 3.153a.991.991 0 1 0 0 1.982h5.406a.991.991 0 1 0 0-1.982H9.297Zm5.496 4.144a.991.991 0 0 0-.99-.99h-3.604a.991.991 0 0 0 0 1.981H13.8a.991.991 0 0 0 .991-.99Z"
      })));
    };

    var _path$20;
    function _extends$2i() { _extends$2i = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2i.apply(this, arguments); }
    var SvgFragileFill = function SvgFragileFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2i({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$20 || (_path$20 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.144 20.126c.509 0 .921.42.921.937a.929.929 0 0 1-.92.937H7.857a.929.929 0 0 1-.92-.937c0-.517.412-.937.92-.937h3.222v-3.17c-3.936-.091-6.888-3.74-6.192-7.709L6.03 2.74a.925.925 0 0 1 .907-.772h5.952L9.854 6.6a.951.951 0 0 0-.046.962c.16.305.472.495.812.495h1.175l-1.054 1.877a.946.946 0 0 0 .343 1.279.912.912 0 0 0 1.256-.349l1.841-3.28a.951.951 0 0 0-.003-.934.918.918 0 0 0-.796-.467H12.34l2.729-4.165a.962.962 0 0 0 .03-.051h1.965c.446 0 .828.325.907.772l1.142 6.507c.696 3.969-2.255 7.617-6.191 7.71v3.17h3.222Z"
      })));
    };

    var _path$1$;
    function _extends$2h() { _extends$2h = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2h.apply(this, arguments); }
    var SvgHeartFill = function SvgHeartFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2h({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1$ || (_path$1$ = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 9.936c0-3.603 2.78-6.193 5.799-6.193 1.16 0 2.185.48 3.015 1.098.435.324.832.698 1.186 1.09a8.266 8.266 0 0 1 1.186-1.09c.83-.619 1.856-1.098 3.015-1.098 3.02 0 5.799 2.59 5.799 6.193 0 3.74-2.6 6.734-4.704 8.59a25.808 25.808 0 0 1-3.015 2.271c-.253.164-.738.414-1.103.598a51.265 51.265 0 0 1-.667.33l-.044.02-.016.008a1.039 1.039 0 0 1-.902 0l-.016-.007-.044-.022a35.214 35.214 0 0 1-.667-.33c-.365-.183-.85-.433-1.104-.597a25.809 25.809 0 0 1-3.014-2.272C4.6 16.67 2 13.677 2 9.936Z"
      })));
    };

    var _path$1_;
    function _extends$2g() { _extends$2g = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2g.apply(this, arguments); }
    var SvgHomeFill = function SvgHomeFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2g({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1_ || (_path$1_ = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10.494 2.965a2.67 2.67 0 0 1 3.012 0l6.785 4.612A2.782 2.782 0 0 1 21.5 9.88v8.853c0 1.528-1.215 2.767-2.714 2.767H15a.896.896 0 0 1-.64-.27.932.932 0 0 1-.265-.652V16.5a1 1 0 0 0-1-1h-2.19a1 1 0 0 0-1 1v4.078c0 .244-.096.479-.265.652-.17.173-.4.27-.64.27H5.214c-1.499 0-2.714-1.24-2.714-2.767V9.88c0-.925.454-1.79 1.209-2.303l6.785-4.612Z"
      })));
    };

    var _path$1Z;
    function _extends$2f() { _extends$2f = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2f.apply(this, arguments); }
    var SvgInfoCircleFill = function SvgInfoCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2f({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1Z || (_path$1Z = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.864-3.864a1.136 1.136 0 1 0 2.272 0 1.136 1.136 0 0 0-2.272 0ZM12 17.455a.91.91 0 0 0 .91-.91v-5.454a.91.91 0 1 0-1.82 0v5.455a.91.91 0 0 0 .91.909Z"
      })));
    };

    var _path$1Y;
    function _extends$2e() { _extends$2e = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2e.apply(this, arguments); }
    var SvgLeftCircleFill = function SvgLeftCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2e({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1Y || (_path$1Y = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12Zm8.448-3.825a.909.909 0 1 1 1.286 1.286l-1.63 1.63h5.987a.91.91 0 1 1 0 1.818h-5.987l1.63 1.63a.909.909 0 1 1-1.286 1.286l-3.182-3.182a.91.91 0 0 1 0-1.286l3.182-3.182Z"
      })));
    };

    var _path$1X, _path2$A;
    function _extends$2d() { _extends$2d = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2d.apply(this, arguments); }
    var SvgLinePointFill = function SvgLinePointFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2d({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1X || (_path$1X = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.087 9.928c-.242-.19-.572-.286-.99-.286h-.792v2.486h.792c.418 0 .748-.095.99-.286.242-.19.363-.517.363-.979 0-.44-.121-.752-.363-.935Z"
      })), _path2$A || (_path2$A = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11ZM9.457 7.926c-.118 0-.176.059-.176.176v7.722c0 .117.058.176.176.176h1.672c.117 0 .176-.059.176-.176v-1.98h.847c1.114 0 1.958-.25 2.53-.748.572-.506.858-1.243.858-2.211 0-.975-.286-1.712-.858-2.211-.572-.499-1.416-.748-2.53-.748H9.457Z"
      })));
    };

    var _path$1W;
    function _extends$2c() { _extends$2c = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2c.apply(this, arguments); }
    var SvgLockFill = function SvgLockFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2c({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1W || (_path$1W = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.5 10.1a2.85 2.85 0 0 1 2.85-2.85h1.029a5.702 5.702 0 0 1 11.242 0h1.029a2.85 2.85 0 0 1 2.85 2.85v8.55a2.85 2.85 0 0 1-2.85 2.85H5.35a2.85 2.85 0 0 1-2.85-2.85V10.1Zm13.181-2.85a3.802 3.802 0 0 0-7.36 0h7.36Zm-4.868 5.7a1.187 1.187 0 1 0 2.374 0 1.187 1.187 0 0 0-2.374 0Zm0 3.324a1.187 1.187 0 1 0 2.374 0 1.187 1.187 0 0 0-2.374 0Z"
      })));
    };

    var _path$1V;
    function _extends$2b() { _extends$2b = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2b.apply(this, arguments); }
    var SvgMailFill = function SvgMailFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2b({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1V || (_path$1V = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "m1.278 6.32 1.192.806.002.001 1.391.942 7.482 4.604a1.25 1.25 0 0 0 1.31 0l7.482-4.604 1.371-.928.009-.006.01-.007.001-.001h.001l.001-.001h.001v-.001l.002-.001.004-.003.002-.001.003-.002.001-.001.006-.004.004-.003h.001l1.168-.79A3.25 3.25 0 0 0 19.5 3.5h-15a3.25 3.25 0 0 0-3.222 2.82ZM22.75 8.714l-.079.054-.008.005-.002.001-.007.005-.001.001h-.001l-.001.001h-.001v.001l-.002.001-.002.001-.002.002h-.002v.002h-.002l-.003.002v.001l-.007.004-.004.003h-.001l-1.385.938a1.029 1.029 0 0 1-.037.024l-7.5 4.615a3.25 3.25 0 0 1-3.406 0l-7.5-4.615a1.005 1.005 0 0 1-.037-.024l-1.41-.954-.1-.068v8.535A3.25 3.25 0 0 0 4.5 20.5h15a3.25 3.25 0 0 0 3.25-3.25V8.715Z"
      })));
    };

    var _path$1U;
    function _extends$2a() { _extends$2a = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2a.apply(this, arguments); }
    var SvgMarkerFill = function SvgMarkerFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2a({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1U || (_path$1U = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3 10.592c0-5.282 4.052-9 9-9s9 3.718 9 9c0 5.127-3.244 8.654-7.682 11.945-.327.242-.722.37-1.124.37h-.388c-.402 0-.797-.128-1.124-.37C6.243 19.247 3 15.72 3 10.592Zm7.105-.474a1.895 1.895 0 1 0 3.79 0 1.895 1.895 0 0 0-3.79 0Z"
      })));
    };

    var _path$1T;
    function _extends$29() { _extends$29 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$29.apply(this, arguments); }
    var SvgMinusCircleFill = function SvgMinusCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$29({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1T || (_path$1T = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm14.546 0a.91.91 0 0 0-.91-.91H8.364a.91.91 0 1 0 0 1.82h7.272a.91.91 0 0 0 .91-.91Z"
      })));
    };

    var _path$1S;
    function _extends$28() { _extends$28 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$28.apply(this, arguments); }
    var SvgNarrowFill = function SvgNarrowFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$28({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1S || (_path$1S = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.864 3.41A2.864 2.864 0 0 0 1 6.274v11.454a2.864 2.864 0 0 0 2.864 2.864h15.272A2.864 2.864 0 0 0 22 17.728V6.274a2.864 2.864 0 0 0-2.864-2.864H3.864Zm12.142 5.608a.955.955 0 1 1 1.49 1.193L16.066 12l1.432 1.79a.955.955 0 1 1-1.49 1.192l-1.91-2.386a.955.955 0 0 1 0-1.192l1.91-2.387Zm-10.5 1.193a.955.955 0 0 1 1.49-1.192l1.91 2.386a.955.955 0 0 1 0 1.193l-1.91 2.386a.955.955 0 1 1-1.49-1.193l1.432-1.79-1.432-1.79Z"
      })));
    };

    var _path$1R;
    function _extends$27() { _extends$27 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$27.apply(this, arguments); }
    var SvgNewCircleFill = function SvgNewCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$27({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1R || (_path$1R = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.63 13.09c0 .643-.374 1-1.003 1-.634 0-1.003-.357-1.003-1V8.865c0-.621.369-.957 1.026-.957.404 0 .692.165 1.01.561l3.183 4.176h.046V8.91c0-.643.375-1 1.004-1 .634 0 1.003.357 1.003 1v6.235c0 .61-.357.946-.997.946-.427 0-.71-.16-1.015-.561l-3.207-4.22h-.046v3.78Z"
      })));
    };

    var _path$1Q;
    function _extends$26() { _extends$26 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$26.apply(this, arguments); }
    var SvgOfficeFill = function SvgOfficeFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$26({
        width: "1em",
        height: "1em",
        viewBox: "0 0 12 12",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1Q || (_path$1Q = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.5 1A1.5 1.5 0 0 0 2 2.5V10h-.5a.5.5 0 0 0 0 1h3.25V8.812C4.75 8.088 5.31 7.5 6 7.5s1.25.588 1.25 1.313V11h3.25a.5.5 0 0 0 0-1H10V2.5A1.5 1.5 0 0 0 8.5 1h-5Zm3 4.5A.5.5 0 0 1 7 5h.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5ZM7 3a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H7Zm-3 .5a.5.5 0 0 1 .5-.5H5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5ZM4.5 5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 0-1h-.5Z"
      })));
    };

    var _path$1P;
    function _extends$25() { _extends$25 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$25.apply(this, arguments); }
    var SvgPlusCircleFill = function SvgPlusCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$25({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1P || (_path$1P = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-.91 6.364a.91.91 0 1 1 1.82 0v2.727h2.726a.91.91 0 0 1 0 1.818H12.91v2.727a.91.91 0 0 1-1.818 0V12.91H8.364a.91.91 0 1 1 0-1.818h2.727V8.364Z"
      })));
    };

    var _path$1O, _path2$z, _path3$5;
    function _extends$24() { _extends$24 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$24.apply(this, arguments); }
    var SvgPrinterFill = function SvgPrinterFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$24({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1O || (_path$1O = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.819 2.5a.864.864 0 0 0-.864.864V5.09h12.09V3.364a.864.864 0 0 0-.863-.864H6.82Z"
      })), _path2$z || (_path2$z = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18.91 17.182a2.59 2.59 0 0 0 2.59-2.59V8.977a2.59 2.59 0 0 0-2.59-2.591H5.09a2.59 2.59 0 0 0-2.59 2.59v5.614a2.59 2.59 0 0 0 2.59 2.591v-5.025c0-.563.443-1.02.988-1.02h11.844c.545 0 .987.457.987 1.02v5.025Zm-.26-8.506a.95.95 0 1 1-1.9 0 .95.95 0 0 1 1.9 0Z"
      })), _path3$5 || (_path3$5 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.818 13.648c0-.433.332-.785.74-.785h8.884c.409 0 .74.352.74.785v7.067c0 .433-.331.785-.74.785H7.559c-.41 0-.74-.352-.74-.785v-7.067Z"
      })));
    };

    var _path$1N;
    function _extends$23() { _extends$23 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$23.apply(this, arguments); }
    var SvgProfileCircleFill = function SvgProfileCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$23({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1N || (_path$1N = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.297-2.523a2.703 2.703 0 1 0 5.406 0 2.703 2.703 0 0 0-5.406 0Zm9.01 7.478c-.902-.9-2.703-2.252-6.307-2.252-3.604 0-5.405 1.351-6.306 2.252.068.068.142.144.22.225.964.991 2.756 2.833 6.086 2.833 3.33 0 5.121-1.841 6.085-2.832.08-.082.153-.158.221-.226Z"
      })));
    };

    var _path$1M;
    function _extends$22() { _extends$22 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$22.apply(this, arguments); }
    var SvgProfileFill = function SvgProfileFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$22({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1M || (_path$1M = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.548 6.921a4.451 4.451 0 1 1 8.902 0 4.451 4.451 0 0 1-8.902 0ZM3.952 15.757C5.28 14.48 7.92 12.63 12 12.63c4.08 0 6.72 1.85 8.048 3.127.995.956 1.127 2.331.775 3.45l-.071.226a3 3 0 0 1-2.861 2.099H6.109a3 3 0 0 1-2.86-2.1l-.072-.226c-.352-1.118-.22-2.493.775-3.449Z"
      })));
    };

    var _path$1L, _path2$y, _path3$4;
    function _extends$21() { _extends$21 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$21.apply(this, arguments); }
    var SvgProfileSettingFill = function SvgProfileSettingFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$21({
        width: "1em",
        height: "1em",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1L || (_path$1L = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10 2.058a3.71 3.71 0 1 0 0 7.419 3.71 3.71 0 0 0 0-7.419Z"
      })), _path2$y || (_path2$y = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10 10.524c-3.4 0-5.6 1.543-6.707 2.607-.83.796-.939 1.942-.646 2.874l.06.189a2.5 2.5 0 0 0 2.384 1.749h5.587a2.13 2.13 0 0 1-.203-.294l-.03-.052a2.125 2.125 0 0 1 .302-2.527 3.327 3.327 0 0 1 0-.14 2.125 2.125 0 0 1-.303-2.527l.03-.053a2.125 2.125 0 0 1 2.346-1.003l.027-.016.083-.046c.03-.107.07-.21.115-.309A10.154 10.154 0 0 0 10 10.524Z"
      })), _path3$4 || (_path3$4 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M15.803 10.833c-.6 0-1.128.398-1.292.974l-.102.36a4.984 4.984 0 0 0-.381.191c-.105.06-.217.138-.303.2l-.355-.09a1.345 1.345 0 0 0-1.492.63l-.032.056c-.3.518-.218 1.17.198 1.6l.258.266a3.896 3.896 0 0 0-.027.396c0 .13.014.283.027.397l-.258.265a1.338 1.338 0 0 0-.198 1.602l.032.054c.3.52.909.777 1.492.63l.343-.085c.085.067.198.15.309.213.12.07.276.138.39.186l.1.348c.163.576.69.974 1.291.974h.06c.6 0 1.128-.398 1.293-.974l.1-.354c.108-.047.25-.113.366-.18.11-.064.23-.15.321-.216l.354.089a1.345 1.345 0 0 0 1.492-.63l.032-.055c.299-.519.218-1.172-.199-1.602l-.257-.265a3.87 3.87 0 0 0 .026-.397c0-.13-.013-.282-.026-.396l.257-.265c.417-.43.498-1.083.199-1.601l-.032-.055c-.3-.52-.91-.777-1.492-.63l-.367.091a5.857 5.857 0 0 0-.316-.201 5.997 5.997 0 0 0-.354-.185l-.105-.367a1.343 1.343 0 0 0-1.292-.974h-.06Zm.028 5.45a.868.868 0 1 1-.002-1.735.868.868 0 0 1 .002 1.736Z"
      })));
    };

    var _path$1K;
    function _extends$20() { _extends$20 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$20.apply(this, arguments); }
    var SvgQuestionCircleFill = function SvgQuestionCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$20({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1K || (_path$1K = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-10.321 2.129c.485 0 .752-.267.854-.725.09-.574.294-.868 1.203-1.394.964-.568 1.463-1.272 1.463-2.304 0-1.593-1.305-2.66-3.247-2.66-1.47 0-2.563.582-3 1.484-.138.26-.206.52-.206.814 0 .52.335.854.875.854.417 0 .725-.191.896-.629.218-.608.67-.936 1.34-.936.751 0 1.27.465 1.27 1.135 0 .628-.266.97-1.148 1.497-.806.471-1.223 1.005-1.223 1.811v.096c0 .56.342.957.923.957Zm.013 3.042c.623 0 1.121-.472 1.121-1.073 0-.602-.498-1.074-1.12-1.074-.616 0-1.115.472-1.115 1.074 0 .601.5 1.073 1.114 1.073Z"
      })));
    };

    var _path$1J, _path2$x;
    function _extends$1$() { _extends$1$ = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1$.apply(this, arguments); }
    var SvgReportFill = function SvgReportFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1$({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1J || (_path$1J = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M14.1 2.782c.412.372.716.864.87 1.454h1.198v4.618H7.856V4.236H9.03c.154-.59.458-1.082.87-1.454C10.493 2.246 11.261 2 12 2c.74 0 1.507.246 2.1.782Z"
      })), _path2$x || (_path2$x = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M16.63 10.24c.51 0 .923-.414.923-.924v-5.08h.16a2.61 2.61 0 0 1 2.61 2.61v12.558a2.61 2.61 0 0 1-2.61 2.61H6.312a2.61 2.61 0 0 1-2.61-2.61V6.846a2.61 2.61 0 0 1 2.61-2.61h.16v5.08c0 .51.414.923.924.923h9.235Zm-3.579 8.874a1.154 1.154 0 1 0 0-2.31 1.154 1.154 0 0 0 0 2.31Zm3.232 0a1.154 1.154 0 1 0 0-2.309 1.154 1.154 0 0 0 0 2.309Z"
      })));
    };

    var _path$1I;
    function _extends$1_() { _extends$1_ = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1_.apply(this, arguments); }
    var SvgRightCircleFill = function SvgRightCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1_({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1I || (_path$1I = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10Zm-8.448 3.825a.909.909 0 1 1-1.286-1.286l1.63-1.63H7.91a.91.91 0 1 1 0-1.818h5.987l-1.63-1.63a.909.909 0 1 1 1.286-1.286l3.182 3.182a.909.909 0 0 1 0 1.286l-3.182 3.182Z"
      })));
    };

    var _path$1H;
    function _extends$1Z() { _extends$1Z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1Z.apply(this, arguments); }
    var SvgSettingFill = function SvgSettingFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1Z({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1H || (_path$1H = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M11.93 1.4A3.1 3.1 0 0 0 8.95 3.653l-.236.832c-.26.119-.612.287-.88.442-.242.14-.499.318-.697.461l-.82-.207A3.1 3.1 0 0 0 2.871 6.64l-.073.126a3.1 3.1 0 0 0 .458 3.703l.593.614c-.029.264-.06.616-.06.917 0 .301.031.653.06.918l-.593.613a3.1 3.1 0 0 0-.458 3.703l.073.126a3.1 3.1 0 0 0 3.443 1.459l.792-.2c.197.155.458.347.713.494.278.162.638.32.9.43l.229.804a3.1 3.1 0 0 0 2.982 2.253h.138a3.1 3.1 0 0 0 2.982-2.253l.233-.818a8.92 8.92 0 0 0 .843-.417c.253-.147.531-.344.741-.5l.817.207a3.1 3.1 0 0 0 3.443-1.459l.073-.126a3.1 3.1 0 0 0-.458-3.703l-.593-.614c.029-.264.06-.616.06-.917 0-.301-.031-.652-.06-.917l.593-.614a3.1 3.1 0 0 0 .458-3.703l-.073-.126a3.1 3.1 0 0 0-3.443-1.459l-.847.214c-.213-.145-.49-.328-.73-.467a13.663 13.663 0 0 0-.816-.427l-.24-.848A3.1 3.1 0 0 0 12.068 1.4h-.138Zm.065 12.605a2.005 2.005 0 1 1 0-4.01 2.005 2.005 0 0 1 0 4.01Z"
      })));
    };

    var _path$1G;
    function _extends$1Y() { _extends$1Y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1Y.apply(this, arguments); }
    var SvgShieldPrivacyFill = function SvgShieldPrivacyFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1Y({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1G || (_path$1G = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.344 2.352a.5.5 0 0 0-.688 0A11.459 11.459 0 0 1 3.604 5.5a.5.5 0 0 0-.481.343A12.49 12.49 0 0 0 2.5 9.751c0 5.825 3.984 10.718 9.375 12.106a.5.5 0 0 0 .25 0c5.39-1.388 9.375-6.281 9.375-12.106 0-1.364-.218-2.678-.623-3.908a.5.5 0 0 0-.481-.343h-.146a11.459 11.459 0 0 1-7.906-3.148Zm2.906 12.781v-2.666c0-.479-.364-.867-.813-.867 0-1.436-1.09-2.6-2.437-2.6-1.346 0-2.438 1.164-2.438 2.6-.448 0-.812.388-.812.867v2.666c0 .479.364.867.813.867h4.874c.45 0 .813-.388.813-.867ZM13.137 11.6c0-.67-.509-1.214-1.137-1.214s-1.138.544-1.138 1.214h2.275Z"
      })));
    };

    var _path$1F;
    function _extends$1X() { _extends$1X = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1X.apply(this, arguments); }
    var SvgShieldWSimFill = function SvgShieldWSimFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1X({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1F || (_path$1F = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.344 2.352a.5.5 0 0 0-.688 0A11.459 11.459 0 0 1 3.604 5.5a.5.5 0 0 0-.481.343A12.49 12.49 0 0 0 2.5 9.751c0 5.825 3.984 10.718 9.375 12.106a.5.5 0 0 0 .25 0c5.39-1.388 9.375-6.281 9.375-12.106 0-1.364-.218-2.678-.623-3.908a.5.5 0 0 0-.481-.343h-.146a11.459 11.459 0 0 1-7.906-3.148ZM9.75 8a.9.9 0 0 0-.9.9v7.2a.9.9 0 0 0 .9.9h4.5a.9.9 0 0 0 .9-.9v-5.495a.9.9 0 0 0-.242-.614l-1.591-1.705A.9.9 0 0 0 12.659 8H9.75Z"
      })));
    };

    var _path$1E;
    function _extends$1W() { _extends$1W = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1W.apply(this, arguments); }
    var SvgStarFill = function SvgStarFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1W({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1E || (_path$1E = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10.184 3.048c.715-1.549 2.917-1.549 3.632 0l2.014 4.364 4.832.69c1.631.233 2.296 2.229 1.13 3.394l-3.456 3.458 1.053 5.265c.332 1.66-1.42 2.956-2.91 2.154L12 19.96l-4.48 2.412c-1.49.802-3.24-.494-2.909-2.154l1.054-5.265-3.458-3.458c-1.165-1.165-.5-3.16 1.132-3.394l4.831-.69 2.014-4.364Z"
      })));
    };

    var _path$1D;
    function _extends$1V() { _extends$1V = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1V.apply(this, arguments); }
    var SvgStoreFill = function SvgStoreFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1V({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1D || (_path$1D = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5.126 2.858 3.45 5.35h17.1l-1.675-2.492a.81.81 0 0 0-.673-.358H5.798a.81.81 0 0 0-.672.358ZM5.139 11.05c1.457 0 2.639-1.216 2.639-2.715V7.249H2.5v1.086c0 1.499 1.181 2.714 2.639 2.714ZM14.639 8.335c0 1.499-1.182 2.714-2.639 2.714-1.457 0-2.639-1.215-2.639-2.714V7.249h5.278v1.086ZM18.861 11.05c-1.457 0-2.639-1.216-2.639-2.715V7.249H21.5v1.086c0 1.499-1.181 2.714-2.639 2.714ZM20.55 19.5a2 2 0 0 1-2 2h-1.08a.72.72 0 0 1-.72-.72v-4.03a.95.95 0 0 0-.95-.95h-1.9a.95.95 0 0 0-.95.95v4.03a.72.72 0 0 1-.72.72H5.45a2 2 0 0 1-2-2v-6.877a4.467 4.467 0 0 0 1.69.328 4.477 4.477 0 0 0 3.43-1.594A4.477 4.477 0 0 0 12 12.951a4.477 4.477 0 0 0 3.43-1.594 4.477 4.477 0 0 0 3.431 1.594c.601 0 1.17-.117 1.69-.328V19.5Z"
      })));
    };

    var _path$1C;
    function _extends$1U() { _extends$1U = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1U.apply(this, arguments); }
    var SvgThumbupFill = function SvgThumbupFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1U({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1C || (_path$1C = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M11.938 2.4c-.427 0-.523.04-.889.192l-.213.088c-.582.235-1.2.71-1.398 1.555-.068.291-.424 1.476-.958 2.868-.43 1.122-.945 2.3-1.48 3.22V21.6h10.542c1.317 0 2.45-.955 2.648-2.266l1.045-6.84a3.1 3.1 0 0 0-3.064-3.568H13.67l.821-3.665c0-.541-.098-1.23-.491-1.816C13.56 2.79 12.846 2.4 11.938 2.4ZM3.5 10.4a1.1 1.1 0 0 0-1.1 1.1v9a1.1 1.1 0 0 0 1.1 1.1h2V10.4h-2Z"
      })));
    };

    var _path$1B;
    function _extends$1T() { _extends$1T = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1T.apply(this, arguments); }
    var SvgTicketFill = function SvgTicketFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1T({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1B || (_path$1B = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M2 3.4A1.1 1.1 0 0 0 .9 4.5v15A1.1 1.1 0 0 0 2 20.6h3.684a1.1 1.1 0 0 0 .668-.226l1.437-1.097 1.438 1.097a1.1 1.1 0 0 0 .668.226H22a1.1 1.1 0 0 0 1.1-1.1v-15A1.1 1.1 0 0 0 22 3.4H9.895a1.1 1.1 0 0 0-.668.226L7.79 4.723 6.352 3.626a1.1 1.1 0 0 0-.668-.226H2Zm4.5 6.35a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm0 4.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Z"
      })));
    };

    var _path$1A;
    function _extends$1S() { _extends$1S = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1S.apply(this, arguments); }
    var SvgTimeFill = function SvgTimeFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1S({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1A || (_path$1A = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12Zm12.25 3.59a.952.952 0 0 0 1.22-1.46l-2.52-2.1V7.71a.95.95 0 1 0-1.9 0v4.77c0 .28.12.55.34.73l2.86 2.38Z"
      })));
    };

    var _path$1z, _path2$w;
    function _extends$1R() { _extends$1R = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1R.apply(this, arguments); }
    var SvgTrashFill = function SvgTrashFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1R({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1z || (_path$1z = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.145 1.892a.889.889 0 0 1 .435-.114h5.531c.491 0 .889.398.889.889v1.777c0 .491-.398.89-.889.89H4.89a.889.889 0 0 1 0-1.778h5.298l2.958-1.664Z"
      })), _path2$w || (_path2$w = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.889 6.222a.889.889 0 0 0-.885.972l1.182 12.61a2.667 2.667 0 0 0 2.655 2.418h8.318a2.667 2.667 0 0 0 2.655-2.418l1.182-12.61a.889.889 0 0 0-.885-.972H4.89Zm6.444 10.063c0 .456-.398.826-.889.826-.49 0-.888-.37-.888-.826v-4.127c0-.456.398-.825.888-.825.491 0 .89.37.89.825v4.127Zm3.111 0c0 .456-.398.826-.888.826-.491 0-.89-.37-.89-.826v-4.127c0-.456.399-.825.89-.825.49 0 .888.37.888.825v4.127Z"
      })));
    };

    var _path$1y;
    function _extends$1Q() { _extends$1Q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1Q.apply(this, arguments); }
    var SvgTriangleUpDown = function SvgTriangleUpDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1Q({
        width: "1em",
        height: "1em",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1y || (_path$1y = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5.15 10.02A.618.618 0 0 1 5.623 9h4.756c.53 0 .816.62.471 1.02l-2.378 2.764a.622.622 0 0 1-.942 0L5.15 10.02ZM10.85 5.98A.618.618 0 0 1 10.377 7H5.622a.618.618 0 0 1-.471-1.02l2.378-2.764a.622.622 0 0 1 .942 0L10.85 5.98Z"
      })));
    };

    var _path$1x;
    function _extends$1P() { _extends$1P = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1P.apply(this, arguments); }
    var SvgUpCircleFill = function SvgUpCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1P({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1x || (_path$1x = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.825-.266a.909.909 0 0 0 0-1.286l-3.182-3.182a.91.91 0 0 0-1.286 0l-3.182 3.182a.909.909 0 1 0 1.286 1.286l1.63-1.63v5.987a.91.91 0 1 0 1.818 0v-5.987l1.63 1.63a.909.909 0 0 0 1.286 0Z"
      })));
    };

    var _path$1w;
    function _extends$1O() { _extends$1O = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1O.apply(this, arguments); }
    var SvgViewRowsFill = function SvgViewRowsFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1O({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1w || (_path$1w = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4 2h16c1.105 0 2 .82 2 1.833v1.834c0 1.012-.895 1.833-2 1.833H4c-1.105 0-2-.82-2-1.833V3.833C2 2.821 2.895 2 4 2ZM4 9.25h16c1.105 0 2 .82 2 1.833v1.834c0 1.012-.895 1.833-2 1.833H4c-1.105 0-2-.82-2-1.833v-1.834c0-1.012.895-1.833 2-1.833ZM4 16.5h16c1.105 0 2 .82 2 1.833v1.834C22 21.179 21.105 22 20 22H4c-1.105 0-2-.82-2-1.833v-1.834c0-1.012.895-1.833 2-1.833Z"
      })));
    };

    var _path$1v;
    function _extends$1N() { _extends$1N = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1N.apply(this, arguments); }
    var SvgWarningCircleFill = function SvgWarningCircleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1N({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1v || (_path$1v = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-10 1.87c.69 0 1.046-.411 1.066-1.115l.123-4.252c.007-.11.014-.232.014-.321 0-.76-.444-1.203-1.196-1.203-.759 0-1.21.444-1.21 1.203l.003.144c.002.058.004.12.004.177l.13 4.252c.02.704.369 1.114 1.066 1.114Zm0 3.356c.71 0 1.292-.54 1.292-1.23 0-.684-.581-1.225-1.292-1.225-.718 0-1.299.54-1.299 1.224 0 .69.581 1.23 1.299 1.23Z"
      })));
    };

    var _path$1u;
    function _extends$1M() { _extends$1M = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1M.apply(this, arguments); }
    var SvgWarningTriangleFill = function SvgWarningTriangleFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1M({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1u || (_path$1u = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M11.59 2c-.716 0-1.376.39-1.726 1.02l-8.36 15.015a2.018 2.018 0 0 0-.026 1.912l.512.985A1.977 1.977 0 0 0 3.742 22h16.516c.735 0 1.41-.411 1.752-1.069l.512-.984c.313-.6.303-1.32-.026-1.912L14.136 3.02A1.976 1.976 0 0 0 12.411 2h-.822Zm1.466 12.476c-.02.704-.372 1.115-1.056 1.115-.69 0-1.035-.41-1.055-1.115l-.129-4.252a5.839 5.839 0 0 0-.004-.196 4.2 4.2 0 0 1-.002-.125c0-.759.446-1.203 1.197-1.203.744 0 1.184.444 1.184 1.203 0 .089-.007.212-.013.321l-.122 4.252Zm.223 3.24c0 .691-.575 1.231-1.279 1.231-.71 0-1.285-.54-1.285-1.23 0-.684.575-1.224 1.285-1.224.704 0 1.279.54 1.279 1.224Z"
      })));
    };

    var _path$1t;
    function _extends$1L() { _extends$1L = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1L.apply(this, arguments); }
    var SvgWideFill = function SvgWideFill(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1L({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1t || (_path$1t = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.864 3.41A2.864 2.864 0 0 0 1 6.273v11.455a2.864 2.864 0 0 0 2.864 2.864h15.272A2.864 2.864 0 0 0 22 17.728V6.273a2.864 2.864 0 0 0-2.864-2.863H3.864Zm3.073 11.573-1.91-2.386a.955.955 0 0 1 0-1.193l1.91-2.386a.955.955 0 1 1 1.49 1.193L6.997 12l1.432 1.79a.955.955 0 0 1-1.491 1.192Zm9.127-5.965 1.909 2.386a.955.955 0 0 1 0 1.193l-1.91 2.386a.954.954 0 1 1-1.49-1.192L16.005 12l-1.432-1.79a.955.955 0 0 1 1.49-1.193Z"
      })));
    };

    var _path$1s;
    function _extends$1K() { _extends$1K = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1K.apply(this, arguments); }
    var SvgBagStroke = function SvgBagStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1K({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1s || (_path$1s = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 1.25c-2.538 0-4.328 1.851-4.685 4.15h-.944a3.1 3.1 0 0 0-3.093 2.894l-.733 11A3.1 3.1 0 0 0 5.638 22.6h12.724a3.1 3.1 0 0 0 3.093-3.306l-.733-11A3.1 3.1 0 0 0 17.629 5.4h-.944C16.328 3.101 14.538 1.25 12 1.25Zm0 2c1.304 0 2.335.862 2.65 2.15h-5.3c.315-1.288 1.346-2.15 2.65-2.15ZM4.74 19.44l.733-11a.9.9 0 0 1 .898-.84h.879V10a1 1 0 1 0 2 0V7.6h5.5V10a1 1 0 1 0 2 0V7.6h.879a.9.9 0 0 1 .898.84l.733 11a.9.9 0 0 1-.898.96H5.638a.9.9 0 0 1-.898-.96Z"
      })));
    };

    var _path$1r, _path2$v;
    function _extends$1J() { _extends$1J = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1J.apply(this, arguments); }
    var SvgBellStroke = function SvgBellStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1J({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1r || (_path$1r = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M13.1 2.3a1.1 1.1 0 0 0-2.2 0v.665a7.1 7.1 0 0 0-6.613 6.68l-.282 4.946a6.9 6.9 0 0 1-.832 2.91l-.638 1.172A1.1 1.1 0 0 0 3.5 20.3h17a1.1 1.1 0 0 0 .966-1.627l-.639-1.171a6.9 6.9 0 0 1-.831-2.91l-.282-4.948a7.1 7.1 0 0 0-6.613-6.68V2.3ZM6.485 9.77a4.9 4.9 0 0 1 4.892-4.62h1.249a4.9 4.9 0 0 1 4.892 4.62l.283 4.947a9.099 9.099 0 0 0 .864 3.383H5.337a9.1 9.1 0 0 0 .864-3.383l.283-4.947Z"
      })), _path2$v || (_path2$v = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10 21.1a1.1 1.1 0 0 0 0 2.2h4a1.1 1.1 0 0 0 0-2.2h-4Z"
      })));
    };

    var _path$1q;
    function _extends$1I() { _extends$1I = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1I.apply(this, arguments); }
    var SvgBikeStroke = function SvgBikeStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1I({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1q || (_path$1q = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18 2.3a2.1 2.1 0 0 0-2.1 2.1v1h-1.4a1.1 1.1 0 0 0 0 2.2h.211l-2.24 2.8h-3.37V8.6H9.5a1.1 1.1 0 1 0 0-2.2H2a1.1 1.1 0 1 0 0 2.2h.685l-1.78 3.413A3.1 3.1 0 0 0 .69 14.36l.5 1.624A4.1 4.1 0 1 0 8.95 18.6h5.1a4.102 4.102 0 0 0 7.951-2h.5a1.1 1.1 0 0 0 1.1-1.1v-1a1.1 1.1 0 0 0-1.1-1.1h-.821l-2.9-5.8H22a1.1 1.1 0 0 0 1.1-1.1V3.4A1.1 1.1 0 0 0 22 2.3h-4ZM6.9 11.5A1.1 1.1 0 0 0 8 12.6h5a1.1 1.1 0 0 0 .86-.412l2.925-3.658 2.546 5.091a4.102 4.102 0 0 0-5.281 2.78h-5.1a4.102 4.102 0 0 0-6.071-2.41l-.086-.28a.9.9 0 0 1 .062-.68L5.167 8.6H6.9v2.9ZM5 19.4a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm13 0a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm2.9-14h-2.8v-.9h2.8v.9Z"
      })));
    };

    var _path$1p;
    function _extends$1H() { _extends$1H = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1H.apply(this, arguments); }
    var SvgBookmarkStore = function SvgBookmarkStore(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1H({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1p || (_path$1p = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.9 4.5A3.1 3.1 0 0 1 6 1.4h12a3.1 3.1 0 0 1 3.1 3.1v16.33c0 1.587-1.693 2.6-3.092 1.85L12 19.463l-6.008 3.219c-1.4.75-3.092-.264-3.092-1.851V4.5ZM6 3.6a.9.9 0 0 0-.9.9v16.163l5.908-3.165a2.1 2.1 0 0 1 1.984 0l5.908 3.165V4.5a.9.9 0 0 0-.9-.9H6Z"
      })));
    };

    var _path$1o, _path2$u;
    function _extends$1G() { _extends$1G = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1G.apply(this, arguments); }
    var SvgBubbleDotsStroke = function SvgBubbleDotsStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1G({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1o || (_path$1o = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M9.25 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13.25 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM17.256 11.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      })), _path2$u || (_path2$u = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 7.25A5.1 5.1 0 0 1 6 2.15h12a5.1 5.1 0 0 1 5.1 5.1v7.5a5.1 5.1 0 0 1-5.1 5.1h-.17l-.772 2.702a1.1 1.1 0 0 1-1.783.526l-3.688-3.228H6a5.1 5.1 0 0 1-5.1-5.1v-7.5ZM6 4.35a2.9 2.9 0 0 0-2.9 2.9v7.5a2.9 2.9 0 0 0 2.9 2.9h6a1.1 1.1 0 0 1 .724.272l2.695 2.358.523-1.832A1.1 1.1 0 0 1 17 17.65h1a2.9 2.9 0 0 0 2.9-2.9v-7.5a2.9 2.9 0 0 0-2.9-2.9H6Z"
      })));
    };

    var _path$1n;
    function _extends$1F() { _extends$1F = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1F.apply(this, arguments); }
    var SvgBubbleStroke = function SvgBubbleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1F({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1n || (_path$1n = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 7.25A5.1 5.1 0 0 1 6 2.15h12a5.1 5.1 0 0 1 5.1 5.1v7.5a5.1 5.1 0 0 1-5.1 5.1h-.17l-.772 2.702a1.1 1.1 0 0 1-1.783.526l-3.688-3.228H6a5.1 5.1 0 0 1-5.1-5.1v-7.5ZM6 4.35a2.9 2.9 0 0 0-2.9 2.9v7.5a2.9 2.9 0 0 0 2.9 2.9h6a1.1 1.1 0 0 1 .724.272l2.695 2.358.523-1.832A1.1 1.1 0 0 1 17 17.65h1a2.9 2.9 0 0 0 2.9-2.9v-7.5a2.9 2.9 0 0 0-2.9-2.9H6Z"
      })));
    };

    var _path$1m;
    function _extends$1E() { _extends$1E = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1E.apply(this, arguments); }
    var SvgBycicleStroke = function SvgBycicleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1E({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1m || (_path$1m = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M14.4 3.5a1.1 1.1 0 0 1 1.1-1.1h3.25a2.85 2.85 0 0 1 0 5.7h-1.224l1.4 4.2H19a4.6 4.6 0 1 1-2.205.563l-.999-2.996-.304.61-2.993 6.484a1.1 1.1 0 0 1-1 .639H9.548a4.601 4.601 0 1 1-3.511-5.183L7.3 9.931l-1.252-2.68h-1.8a1.1 1.1 0 1 1 0-2.2h5a1.1 1.1 0 1 1 0 2.2h-.772l.77 1.649h4.573l1.196-2.392A1.1 1.1 0 0 1 16 5.9h2.75a.65.65 0 1 0 0-1.3H15.5a1.1 1.1 0 0 1-1.1-1.1Zm-5.226 7.6-1.176 2.312A4.607 4.607 0 0 1 9.35 15.4h1.446l1.985-4.3H9.174ZM5 14.5a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm14 0a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"
      })));
    };

    var _path$1l, _path2$t;
    function _extends$1D() { _extends$1D = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1D.apply(this, arguments); }
    var SvgCalendarAStroke = function SvgCalendarAStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1D({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1l || (_path$1l = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M18 16.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13.25 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      })), _path2$t || (_path2$t = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 1.4a1.1 1.1 0 0 1 1.1 1.1v1.4h5.8V2.5a1.1 1.1 0 0 1 2.2 0v1.4H19A3.1 3.1 0 0 1 22.1 7v12a3.1 3.1 0 0 1-3.1 3.1H5A3.1 3.1 0 0 1 1.9 19V7A3.1 3.1 0 0 1 5 3.9h1.9V2.5A1.1 1.1 0 0 1 8 1.4ZM5 6.1a.9.9 0 0 0-.9.9v1.4h15.8V7a.9.9 0 0 0-.9-.9H5Zm14 13.8a.9.9 0 0 0 .9-.9v-8.4H4.1V19a.9.9 0 0 0 .9.9h14Z"
      })));
    };

    var _path$1k, _path2$s;
    function _extends$1C() { _extends$1C = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1C.apply(this, arguments); }
    var SvgCalendarBStroke = function SvgCalendarBStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1C({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1k || (_path$1k = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.75 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM13.25 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM18 16.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13.25 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      })), _path2$s || (_path2$s = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 1.9A3.1 3.1 0 0 0 1.9 5v14A3.1 3.1 0 0 0 5 22.1h14a3.1 3.1 0 0 0 3.1-3.1V5A3.1 3.1 0 0 0 19 1.9H5ZM4.1 5a.9.9 0 0 1 .9-.9h14a.9.9 0 0 1 .9.9v1.4H4.1V5Zm15.8 14a.9.9 0 0 1-.9.9H5a.9.9 0 0 1-.9-.9V8.6h15.8V19Z"
      })));
    };

    var _g$h, _defs$j;
    function _extends$1B() { _extends$1B = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1B.apply(this, arguments); }
    var SvgCallCircleStroke = function SvgCallCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1B({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$h || (_g$h = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#call-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "m10.196 11.26.804-.804c.48-.48.515-1.269.086-1.887l-.538-.827c-.57-.82-1.694-.992-2.329-.357l-.695.695c-.687.688-.626 1.815-.232 2.889.406 1.104 1.216 2.324 2.315 3.424 1.1 1.1 2.32 1.909 3.424 2.314 1.074.395 2.201.456 2.889-.231l.695-.695c.635-.635.463-1.76-.357-2.33l-.829-.539c-.618-.43-1.408-.393-1.887.086l-.804.804a2.448 2.448 0 0 1-.034-.018c-.23-.125-.638-.403-1.361-1.127-.724-.723-1.004-1.132-1.13-1.363a2.454 2.454 0 0 1-.017-.034Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$j || (_defs$j = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "call-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$1j;
    function _extends$1A() { _extends$1A = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1A.apply(this, arguments); }
    var SvgCallStroke = function SvgCallStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1A({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1j || (_path$1j = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "m9.345 10.179 1.028-1.028a3.088 3.088 0 0 0 .387-3.894l-1.25-1.88a3.088 3.088 0 0 0-4.754-.472L3.248 4.413c-1.493 1.492-1.493 3.805-.801 5.971.711 2.227 2.241 4.649 4.38 6.788 2.14 2.14 4.562 3.67 6.789 4.381 2.166.692 4.479.692 5.971-.8l1.509-1.509a3.088 3.088 0 0 0-.473-4.754l-1.88-1.25a3.088 3.088 0 0 0-3.894.387l-1.028 1.028a4.955 4.955 0 0 1-.058-.029l-.008-.004c-.461-.232-1.269-.76-2.443-1.934-1.175-1.174-1.702-1.982-1.934-2.443l-.004-.008-.029-.058Zm8.184 4.885 1.88 1.25c.471.314.537.98.137 1.38l-1.508 1.509c-.615.615-1.865.866-3.756.263-1.83-.585-3.96-1.899-5.905-3.843-1.944-1.945-3.258-4.075-3.843-5.905-.603-1.89-.352-3.141.263-3.756l1.508-1.508a.896.896 0 0 1 1.38.137l1.251 1.88a.896.896 0 0 1-.112 1.13L7.336 9.09c-.196.196-.31.46-.32.737v.041a1.403 1.403 0 0 0 .009.164c.008.085.025.187.053.304.057.236.16.534.343.897.365.723 1.05 1.715 2.341 3.006 1.29 1.29 2.283 1.976 3.006 2.34.363.184.661.287.897.344a2.365 2.365 0 0 0 .42.062H14.174c.278-.01.541-.124.737-.32l1.488-1.488a.896.896 0 0 1 1.13-.112Z"
      })));
    };

    var _path$1i, _path2$r, _path3$3;
    function _extends$1z() { _extends$1z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1z.apply(this, arguments); }
    var SvgCameraStroke = function SvgCameraStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1z({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1i || (_path$1i = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9.4 13.5a4.1 4.1 0 1 1 8.2 0 4.1 4.1 0 0 1-8.2 0Zm4.1-1.9a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
      })), _path2$r || (_path2$r = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.204 12a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      })), _path3$3 || (_path3$3 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.182 2.4a1.1 1.1 0 0 0-.964.57L7.713 5.705H3.818A2.918 2.918 0 0 0 .9 8.624v10.058A2.918 2.918 0 0 0 3.818 21.6h16.364a2.918 2.918 0 0 0 2.918-2.918V8.624a2.918 2.918 0 0 0-2.918-2.919h-1.168L17.509 2.97a1.1 1.1 0 0 0-.964-.57h-6.363Zm-.855 4.936L10.832 4.6h5.063L17.4 7.336a1.1 1.1 0 0 0 .963.57h1.819c.396 0 .718.32.718.718v10.058a.718.718 0 0 1-.718.718H3.818a.718.718 0 0 1-.718-.718V8.624c0-.397.321-.719.718-.719h4.546a1.1 1.1 0 0 0 .963-.57Z"
      })));
    };

    var _path$1h;
    function _extends$1y() { _extends$1y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1y.apply(this, arguments); }
    var SvgCarStorke = function SvgCarStorke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1y({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1h || (_path$1h = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.016 4.245.488 8.069.4 8.47V16c0 .76.405 1.427 1.01 1.796a4.1 4.1 0 0 0 8.146.304h3.888a4.1 4.1 0 0 0 8.154-.465l1.693-1.753a1.1 1.1 0 0 0 .309-.764v-2.973a3.1 3.1 0 0 0-1.767-2.799l-3.56-1.696-2.029-3.38a3.85 3.85 0 0 0-3.301-1.87H4.74c-1.2 0-2.279.73-2.724 1.845ZM3.124 7.4l.935-2.339a.733.733 0 0 1 .68-.461H7.4v2.8H3.124Zm14.127 2.2 3.636 1.732a.9.9 0 0 1 .513.813v2.528l-.507.525a4.101 4.101 0 0 0-7.17.702H9.277A4.101 4.101 0 0 0 2.6 14.602V9.6H17.25Zm-2.893-4.199 1.2 1.999H9.598V4.6h3.344c.58 0 1.117.304 1.415.801ZM5.5 19.4a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm10.1-1.9a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0Z"
      })));
    };

    var _path$1g;
    function _extends$1x() { _extends$1x = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1x.apply(this, arguments); }
    var SvgChartStroke = function SvgChartStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1x({
        width: "1em",
        height: "1em",
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1g || (_path$1g = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M3.125 2.5v9.583c0 .92.746 1.667 1.667 1.667h2.083M3.125 2.5h-1.25m1.25 0h13.75m0 0h1.25m-1.25 0v9.583c0 .92-.746 1.667-1.667 1.667h-2.083m-6.25 0h6.25m-6.25 0-.833 2.5m7.083-2.5.833 2.5m0 0 .417 1.25m-.417-1.25H6.042m0 0-.417 1.25M7.5 9.375v1.25M10 7.5v3.125m2.5-5v5",
        stroke: "currentColor",
        strokeWidth: 1.833,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })));
    };

    var _g$g, _defs$i;
    function _extends$1w() { _extends$1w = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1w.apply(this, arguments); }
    var SvgCloseCircleStroke = function SvgCloseCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1w({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$g || (_g$g = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#close-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.722 7.722a1.1 1.1 0 0 1 1.556 0L12 10.444l2.722-2.722a1.1 1.1 0 1 1 1.556 1.556L13.556 12l2.722 2.722a1.1 1.1 0 1 1-1.556 1.556L12 13.556l-2.722 2.722a1.1 1.1 0 1 1-1.556-1.556L10.444 12 7.722 9.278a1.1 1.1 0 0 1 0-1.556Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$i || (_defs$i = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "close-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$1f, _path2$q;
    function _extends$1v() { _extends$1v = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1v.apply(this, arguments); }
    var SvgCopyStroke = function SvgCopyStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1v({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1f || (_path$1f = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8.833 5.667A3.167 3.167 0 0 1 12 2.5h6.333A3.167 3.167 0 0 1 21.5 5.667V12a3.167 3.167 0 0 1-3.167 3.167H12A3.167 3.167 0 0 1 8.833 12V5.667ZM12 4.61c-.583 0-1.056.473-1.056 1.056V12c0 .583.473 1.056 1.056 1.056h6.333c.583 0 1.056-.473 1.056-1.056V5.667c0-.583-.473-1.056-1.056-1.056H12Z"
      })), _path2$q || (_path2$q = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5.667 10.944c-.583 0-1.056.473-1.056 1.056v6.333c0 .583.473 1.056 1.056 1.056H12c.583 0 1.056-.473 1.056-1.056v-.82h2.11v.82A3.167 3.167 0 0 1 12 21.5H5.667A3.167 3.167 0 0 1 2.5 18.333V12a3.167 3.167 0 0 1 3.167-3.167h.82v2.111h-.82Z"
      })));
    };

    var _path$1e;
    function _extends$1u() { _extends$1u = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1u.apply(this, arguments); }
    var SvgCreditcardStroke = function SvgCreditcardStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1u({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1e || (_path$1e = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1 6.066A3.069 3.069 0 0 1 4.072 3h15.856A3.069 3.069 0 0 1 23 6.066v11.868A3.069 3.069 0 0 1 19.928 21H4.072A3.069 3.069 0 0 1 1 17.934V6.066Zm3.072-.89a.891.891 0 0 0-.892.89V8h17.64V6.066c0-.492-.4-.89-.892-.89H4.072Zm15.856 13.648a.891.891 0 0 0 .892-.89V10H3.18v7.934c0 .492.4.89.892.89h15.856Z"
      })));
    };

    var _path$1d, _path2$p;
    function _extends$1t() { _extends$1t = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1t.apply(this, arguments); }
    var SvgDeleteStroke = function SvgDeleteStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1t({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1d || (_path$1d = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M9.822 8.222a1.1 1.1 0 0 1 1.556 0l2.222 2.222 2.222-2.222a1.1 1.1 0 1 1 1.556 1.556L15.155 12l2.223 2.222a1.1 1.1 0 1 1-1.556 1.556L13.6 13.556l-2.222 2.222a1.1 1.1 0 1 1-1.556-1.556L12.044 12 9.822 9.778a1.1 1.1 0 0 1 0-1.556Z"
      })), _path2$p || (_path2$p = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.98 4.357A3.1 3.1 0 0 1 7.608 2.9H20A3.1 3.1 0 0 1 23.1 6v12a3.1 3.1 0 0 1-3.1 3.1H7.608a3.1 3.1 0 0 1-2.628-1.457l-3.75-6a3.1 3.1 0 0 1 0-3.286l3.75-6Zm2.628.743a.9.9 0 0 0-.763.423l-3.75 6a.9.9 0 0 0 0 .954l3.75 6a.9.9 0 0 0 .763.423H20a.9.9 0 0 0 .9-.9V6a.9.9 0 0 0-.9-.9H7.608Z"
      })));
    };

    var _path$1c, _path2$o;
    function _extends$1s() { _extends$1s = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1s.apply(this, arguments); }
    var SvgDeliveryStroke = function SvgDeliveryStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1s({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1c || (_path$1c = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.9 3.5A1.1 1.1 0 0 1 3 2.4h11a3.1 3.1 0 0 1 3.08 2.75h2.091a3.1 3.1 0 0 1 2.858 1.9l1.585 3.774a1.1 1.1 0 0 1 .086.426v4a3.1 3.1 0 0 1-3.1 3.1h-.002a3.6 3.6 0 0 1-7.197 0H8.1a3.6 3.6 0 1 1-.675-2.2h6.651c.229-.317.508-.596.825-.824V5.5a.9.9 0 0 0-.9-.9H3a1.1 1.1 0 0 1-1.1-1.1Zm15.2 11.151a3.596 3.596 0 0 1 2.824 1.499h.676a.9.9 0 0 0 .9-.9v-2.9h-4.4v2.301Zm2.9-6.75a.9.9 0 0 0-.829-.551H17.1v2.8h3.845l-.944-2.248ZM3.1 18.25a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm12.5 0a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Z"
      })), _path2$o || (_path2$o = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M.4 8a1.1 1.1 0 0 1 1.1-1.1H8a1.1 1.1 0 1 1 0 2.2H1.5A1.1 1.1 0 0 1 .4 8ZM1.9 12A1.1 1.1 0 0 1 3 10.9h7a1.1 1.1 0 0 1 0 2.2H3A1.1 1.1 0 0 1 1.9 12Z"
      })));
    };

    var _path$1b, _path2$n;
    function _extends$1r() { _extends$1r = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1r.apply(this, arguments); }
    var SvgDocumentStroke = function SvgDocumentStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1r({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1b || (_path$1b = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.65 8a1.1 1.1 0 0 1 1.1-1.1h6.5a1.1 1.1 0 0 1 0 2.2h-6.5A1.1 1.1 0 0 1 7.65 8ZM7.65 12a1.1 1.1 0 0 1 1.1-1.1h6.5a1.1 1.1 0 0 1 0 2.2h-6.5a1.1 1.1 0 0 1-1.1-1.1ZM8.75 14.9a1.1 1.1 0 0 0 0 2.2h3a1.1 1.1 0 0 0 0-2.2h-3Z"
      })), _path2$n || (_path2$n = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.9 4.5A3.1 3.1 0 0 1 6 1.4h12a3.1 3.1 0 0 1 3.1 3.1v16a2.1 2.1 0 0 1-2.1 2.1H5a2.1 2.1 0 0 1-2.1-2.1v-16ZM6 3.6a.9.9 0 0 0-.9.9v15.9h13.8V4.5a.9.9 0 0 0-.9-.9H6Z"
      })));
    };

    var _g$f, _defs$h;
    function _extends$1q() { _extends$1q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1q.apply(this, arguments); }
    var SvgDownCircleStroke = function SvgDownCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1q({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$f || (_g$f = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#down-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M9.278 12.222a1.1 1.1 0 1 0-1.556 1.556l3.5 3.5a1.1 1.1 0 0 0 1.556 0l3.5-3.5a1.1 1.1 0 1 0-1.556-1.556L13.1 13.844V7.5a1.1 1.1 0 0 0-2.2 0v6.344l-1.622-1.622Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM3.1 12a8.9 8.9 0 1 1 17.8 0 8.9 8.9 0 0 1-17.8 0Z"
      }))), _defs$h || (_defs$h = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "down-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$1a;
    function _extends$1p() { _extends$1p = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1p.apply(this, arguments); }
    var SvgEditStroke = function SvgEditStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1p({
        width: "1em",
        height: "1em",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1a || (_path$1a = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M14.207 5.262a2 2 0 0 0 0-2.828l-.47-.47a2 2 0 0 0-2.828 0l-8.443 8.443a2 2 0 0 0-.535.968l-.377 1.645a1.333 1.333 0 0 0 1.598 1.597l1.645-.377a2 2 0 0 0 .967-.535l8.443-8.443Zm-.943-1.885c.26.26.26.682 0 .943l-1.672 1.672L10.18 4.58l1.672-1.673c.26-.26.682-.26.942 0l.47.47ZM9.237 5.522l1.412 1.413-5.828 5.827a.667.667 0 0 1-.322.178l-1.645.378.377-1.646a.667.667 0 0 1 .178-.322l5.828-5.828Z"
      })));
    };

    var _g$e, _defs$g;
    function _extends$1o() { _extends$1o = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1o.apply(this, arguments); }
    var SvgExchangeCircleStroke = function SvgExchangeCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1o({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$e || (_g$e = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#exchange-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10.1 7.5a1.1 1.1 0 1 0-2.2 0v6.344l-.122-.122a1.1 1.1 0 1 0-1.556 1.556l2 2a1.1 1.1 0 0 0 1.556 0l2-2a1.1 1.1 0 1 0-1.556-1.556l-.122.122V7.5ZM15.778 6.722a1.1 1.1 0 0 0-1.556 0l-2 2a1.1 1.1 0 1 0 1.556 1.556l.122-.122V16.5a1.1 1.1 0 0 0 2.2 0v-6.344l.122.122a1.1 1.1 0 1 0 1.556-1.556l-2-2Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M23.1 12C23.1 5.87 18.13.9 12 .9S.9 5.87.9 12 5.87 23.1 12 23.1 23.1 18.13 23.1 12ZM12 20.9a8.9 8.9 0 1 1 0-17.8 8.9 8.9 0 0 1 0 17.8Z"
      }))), _defs$g || (_defs$g = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "exchange-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$19, _path2$m, _path3$2;
    function _extends$1n() { _extends$1n = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1n.apply(this, arguments); }
    var SvgEyeSlashStroke = function SvgEyeSlashStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1n({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$19 || (_path$19 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M21.97 3.444a1.1 1.1 0 0 1 0 1.556l-2.022 2.022c1.21 1.25 2.247 2.778 3.05 4.517a1.1 1.1 0 0 1 0 .922C20.735 17.362 16.607 20.6 12 20.6c-1.588 0-3.12-.385-4.538-1.091L5 21.97a1.1 1.1 0 1 1-1.556-1.555l16.97-16.971a1.1 1.1 0 0 1 1.556 0Zm-3.576 5.132-2.841 2.84a3.6 3.6 0 0 1-4.136 4.136l-2.289 2.29A7.82 7.82 0 0 0 12 18.4c3.379 0 6.734-2.314 8.78-6.4-.67-1.338-1.48-2.485-2.385-3.424Z"
      })), _path2$m || (_path2$m = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 5.6c.968 0 1.935.19 2.87.558l1.668-1.668c-1.418-.705-2.95-1.09-4.539-1.09-4.606 0-8.734 3.238-10.998 8.139a1.1 1.1 0 0 0 0 .922c.803 1.738 1.84 3.267 3.05 4.516l1.554-1.554C4.7 14.485 3.89 13.337 3.22 12 5.267 7.914 8.622 5.6 12 5.6Z"
      })), _path3$2 || (_path3$2 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.582 8.447a3.6 3.6 0 0 0-4.135 4.135l4.135-4.135Z"
      })));
    };

    var _path$18, _path2$l;
    function _extends$1m() { _extends$1m = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1m.apply(this, arguments); }
    var SvgEyeStroke = function SvgEyeStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1m({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$18 || (_path$18 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8.4 12a3.6 3.6 0 1 1 7.2 0 3.6 3.6 0 0 1-7.2 0Zm3.6-1.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
      })), _path2$l || (_path2$l = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.438 10.657C3.768 6.257 7.676 3.4 11.999 3.4c4.325 0 8.232 2.858 10.563 7.257.445.84.445 1.846 0 2.686-2.33 4.4-6.238 7.257-10.563 7.257-4.323 0-8.23-2.858-10.561-7.257a2.869 2.869 0 0 1 0-2.686ZM11.999 5.6c-3.29 0-6.554 2.192-8.617 6.087a.669.669 0 0 0 0 .626c2.063 3.895 5.327 6.087 8.617 6.087 3.292 0 6.556-2.192 8.619-6.087a.669.669 0 0 0 0-.626C18.555 7.792 15.29 5.6 11.999 5.6Z"
      })));
    };

    var _g$d, _defs$f;
    function _extends$1l() { _extends$1l = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1l.apply(this, arguments); }
    var SvgFilterCircleStroke = function SvgFilterCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1l({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$d || (_g$d = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#filter-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.9 9A1.1 1.1 0 0 1 8 7.9h8a1.1 1.1 0 0 1 0 2.2H8A1.1 1.1 0 0 1 6.9 9ZM7.9 12.5A1.1 1.1 0 0 1 9 11.4h6a1.1 1.1 0 0 1 0 2.2H9a1.1 1.1 0 0 1-1.1-1.1ZM10 14.9a1.1 1.1 0 0 0 0 2.2h4a1.1 1.1 0 0 0 0-2.2h-4Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$f || (_defs$f = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "filter-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$17;
    function _extends$1k() { _extends$1k = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1k.apply(this, arguments); }
    var SvgFragileStroke = function SvgFragileStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1k({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$17 || (_path$17 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5.417 2.057A1.1 1.1 0 0 1 6.5 1.15h11a1.1 1.1 0 0 1 1.083.907l1.24 6.945c.762 4.264-2.435 8.187-6.723 8.343v3.305h3.4a1.1 1.1 0 0 1 0 2.2h-9a1.1 1.1 0 0 1 0-2.2h3.4v-3.305c-4.288-.157-7.484-4.08-6.723-8.343l1.24-6.945ZM7.421 3.35 6.343 9.389a4.9 4.9 0 0 0 4.823 5.761h1.668a4.9 4.9 0 0 0 4.823-5.761L16.58 3.35h-2.931l-1.278 2.3h1.13a1.1 1.1 0 0 1 .956 1.646l-2 3.5a1.1 1.1 0 0 1-1.91-1.092l1.059-1.854H10.5a1.1 1.1 0 0 1-.961-1.634L11.13 3.35H7.42Z"
      })));
    };

    var _path$16;
    function _extends$1j() { _extends$1j = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1j.apply(this, arguments); }
    var SvgGlobeStroke = function SvgGlobeStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1j({
        width: "1em",
        height: "1em",
        viewBox: "0 0 17 16",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$16 || (_path$16 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.247 4.893c.254.183.52.35.797.501.15-.67.357-1.287.612-1.828a5.296 5.296 0 0 0-1.409 1.327ZM8.5 1.267a6.731 6.731 0 0 0-6.52 8.418 6.736 6.736 0 0 0 13.04 0 6.744 6.744 0 0 0-.653-4.99A6.731 6.731 0 0 0 8.5 1.266Zm0 1.466c-.401 0-.962.344-1.465 1.352a7.41 7.41 0 0 0-.612 1.88 7.27 7.27 0 0 0 2.077.302c.722 0 1.42-.106 2.077-.301a7.409 7.409 0 0 0-.612-1.88C9.461 3.076 8.901 2.732 8.5 2.732Zm3.456 2.661a8.772 8.772 0 0 0-.612-1.828 5.295 5.295 0 0 1 1.409 1.327c-.254.183-.52.35-.797.501ZM10.753 7.44a8.744 8.744 0 0 1-2.253.293 8.744 8.744 0 0 1-2.253-.293 10.675 10.675 0 0 0 .184 2.637 11.33 11.33 0 0 0 4.138 0c.126-.634.198-1.335.198-2.077 0-.19-.005-.377-.014-.56Zm1.37 2.232a12.48 12.48 0 0 0 .065-2.753 8.726 8.726 0 0 0 1.262-.723 5.297 5.297 0 0 1 .22 2.818c-.496.256-1.013.476-1.548.658Zm-2.027 1.962a12.854 12.854 0 0 1-3.192 0c.042.097.086.19.13.28.504 1.008 1.065 1.353 1.466 1.353s.961-.345 1.465-1.352c.045-.09.089-.184.13-.28Zm1.248.8c.163-.346.307-.723.428-1.125.366-.097.725-.21 1.078-.338a5.295 5.295 0 0 1-1.506 1.463Zm-5.688 0a8.15 8.15 0 0 1-.428-1.125c-.366-.097-.725-.21-1.078-.338.399.582.912 1.08 1.506 1.463Zm-2.325-3.42c.495.256 1.012.476 1.546.658a12.479 12.479 0 0 1-.065-2.753 8.726 8.726 0 0 1-1.262-.723 5.298 5.298 0 0 0-.22 2.818Z"
      })));
    };

    var _path$15;
    function _extends$1i() { _extends$1i = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1i.apply(this, arguments); }
    var SvgHeartStroke = function SvgHeartStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1i({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$15 || (_path$15 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.4 9.764C1.4 5.944 4.346 3.2 7.547 3.2c1.229 0 2.316.508 3.196 1.163.46.344.881.74 1.257 1.157a8.76 8.76 0 0 1 1.257-1.157c.88-.655 1.967-1.163 3.196-1.163 3.2 0 6.147 2.745 6.147 6.564 0 3.965-2.756 7.138-4.987 9.105a27.35 27.35 0 0 1-3.195 2.408c-.268.173-.782.438-1.17.633a55.08 55.08 0 0 1-.706.35l-.047.022-.017.009a1.101 1.101 0 0 1-.956 0l-.017-.009-.047-.022a41.435 41.435 0 0 1-.707-.35c-.387-.195-.9-.46-1.17-.633a27.344 27.344 0 0 1-3.195-2.408C4.156 16.902 1.4 13.729 1.4 9.764ZM12 20.078s1.182-.69 1.534-.918a22.115 22.115 0 0 0 2.58-1.944c1.841-1.623 4.286-4.251 4.286-7.166 0-2.724-1.736-4.65-3.9-4.65-.93 0-2.5.9-3.5 2.4-.287.287-.41.41-.557.48-.108.052-.23.076-.443.117-.213-.041-.335-.065-.443-.117-.147-.07-.27-.193-.557-.48-1-1.5-2.57-2.4-3.5-2.4-2.164 0-3.9 1.926-3.9 4.65 0 2.915 2.445 5.543 4.285 7.166a22.11 22.11 0 0 0 2.582 1.944 71.23 71.23 0 0 0 1.533.918Z"
      })));
    };

    var _path$14;
    function _extends$1h() { _extends$1h = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1h.apply(this, arguments); }
    var SvgHomeStroke = function SvgHomeStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1h({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$14 || (_path$14 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.28 2.324a3.1 3.1 0 0 1 3.44 0l7.5 5a3.1 3.1 0 0 1 1.38 2.58V19.5a3.1 3.1 0 0 1-3.1 3.1h-4.861a1.1 1.1 0 0 1-1.1-1.1v-5.233H10.46V21.5a1.1 1.1 0 0 1-1.1 1.1H4.5a3.1 3.1 0 0 1-3.1-3.1V9.904a3.1 3.1 0 0 1 1.38-2.58l7.5-5Zm2.22 1.83a.9.9 0 0 0-1 0l-7.5 5a.9.9 0 0 0-.4.75V19.5a.9.9 0 0 0 .9.9H8.26v-5.233a1.1 1.1 0 0 1 1.1-1.1h5.278a1.1 1.1 0 0 1 1.1 1.1V20.4h3.76a.9.9 0 0 0 .9-.9V9.904a.9.9 0 0 0-.4-.75l-7.5-5Z"
      })));
    };

    var _g$c, _defs$e;
    function _extends$1g() { _extends$1g = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1g.apply(this, arguments); }
    var SvgInfoCircleStroke = function SvgInfoCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1g({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$c || (_g$c = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#info-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 12 9ZM12 9.9a1.1 1.1 0 0 1 1.1 1.1v6a1.1 1.1 0 0 1-2.2 0v-6A1.1 1.1 0 0 1 12 9.9Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM3.1 12a8.9 8.9 0 1 1 17.8 0 8.9 8.9 0 0 1-17.8 0Z"
      }))), _defs$e || (_defs$e = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "info-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _g$b, _defs$d;
    function _extends$1f() { _extends$1f = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1f.apply(this, arguments); }
    var SvgLeftCircleStroke = function SvgLeftCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1f({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$b || (_g$b = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#left-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M11.778 7.722a1.1 1.1 0 0 1 0 1.556L10.155 10.9H16.5a1.1 1.1 0 0 1 0 2.2h-6.345l1.623 1.622a1.1 1.1 0 1 1-1.556 1.556l-3.5-3.5a1.1 1.1 0 0 1 0-1.556l3.5-3.5a1.1 1.1 0 0 1 1.556 0Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 .9C18.13.9 23.1 5.87 23.1 12S18.13 23.1 12 23.1.9 18.13.9 12 5.87.9 12 .9ZM20.9 12a8.9 8.9 0 1 0-17.8 0 8.9 8.9 0 0 0 17.8 0Z"
      }))), _defs$d || (_defs$d = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "left-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$13, _path2$k;
    function _extends$1e() { _extends$1e = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1e.apply(this, arguments); }
    var SvgLinePointStroke = function SvgLinePointStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1e({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$13 || (_path$13 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9.457 16c-.118 0-.176-.059-.176-.176V8.102c0-.117.058-.176.176-.176h2.695c1.114 0 1.958.25 2.53.748.572.499.858 1.236.858 2.211 0 .968-.286 1.705-.858 2.211-.572.499-1.416.748-2.53.748h-.847v1.98c0 .117-.059.176-.176.176H9.457Zm3.63-6.072c-.242-.19-.572-.286-.99-.286h-.792v2.486h.792c.418 0 .748-.095.99-.286.242-.19.363-.517.363-.979 0-.44-.121-.752-.363-.935Z"
      })), _path2$k || (_path2$k = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Zm0-20a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"
      })));
    };

    var _path$12, _path2$j;
    function _extends$1d() { _extends$1d = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1d.apply(this, arguments); }
    var SvgLockStroke = function SvgLockStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1d({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$12 || (_path$12 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10.75 13a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM12 17.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
      })), _path2$j || (_path2$j = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 6.9A3.1 3.1 0 0 0 1.9 10v9A3.1 3.1 0 0 0 5 22.1h14a3.1 3.1 0 0 0 3.1-3.1v-9A3.1 3.1 0 0 0 19 6.9h-1.1a6.002 6.002 0 0 0-11.8 0H5Zm0 13a.9.9 0 0 1-.9-.9v-9a.9.9 0 0 1 .9-.9h14a.9.9 0 0 1 .9.9v9a.9.9 0 0 1-.9.9H5Zm3.153-13a4.002 4.002 0 0 1 7.694 0H8.152Z"
      })));
    };

    var _path$11;
    function _extends$1c() { _extends$1c = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1c.apply(this, arguments); }
    var SvgMailStroke = function SvgMailStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1c({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$11 || (_path$11 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.25 6.75A3.25 3.25 0 0 1 4.5 3.5h15a3.25 3.25 0 0 1 3.25 3.25v10.5a3.25 3.25 0 0 1-3.25 3.25h-15a3.25 3.25 0 0 1-3.25-3.25V6.75Zm2 0v.243c0 .434.225.837.595 1.064l7.5 4.616a1.25 1.25 0 0 0 1.31 0l7.5-4.616c.37-.227.595-.63.595-1.064V6.75c0-.69-.56-1.25-1.25-1.25h-15c-.69 0-1.25.56-1.25 1.25Zm17.5 3.29-7.047 4.336a3.25 3.25 0 0 1-3.406 0L3.25 10.04v7.21c0 .69.56 1.25 1.25 1.25h15c.69 0 1.25-.56 1.25-1.25v-7.21Z"
      })));
    };

    var _path$10, _path2$i;
    function _extends$1b() { _extends$1b = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1b.apply(this, arguments); }
    var SvgMarkerStroke = function SvgMarkerStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1b({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$10 || (_path$10 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
      })), _path2$i || (_path2$i = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2.5 10.5C2.5 4.924 6.777 1 12 1s9.5 3.924 9.5 9.5c0 5.412-3.424 9.135-8.11 12.609a1.993 1.993 0 0 1-1.186.391h-.408c-.425 0-.842-.136-1.187-.391C5.924 19.635 2.5 15.912 2.5 10.5ZM12 3c-4.166 0-7.5 3.076-7.5 7.5 0 4.402 2.716 7.603 7.297 11h.406c4.58-3.397 7.297-6.598 7.297-11C19.5 6.076 16.166 3 12 3Z"
      })));
    };

    var _g$a, _defs$c;
    function _extends$1a() { _extends$1a = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1a.apply(this, arguments); }
    var SvgMinusCircleStroke = function SvgMinusCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1a({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$a || (_g$a = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#minus-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.9 12A1.1 1.1 0 0 1 8 10.9h8a1.1 1.1 0 0 1 0 2.2H8A1.1 1.1 0 0 1 6.9 12Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$c || (_defs$c = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "minus-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$$;
    function _extends$19() { _extends$19 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$19.apply(this, arguments); }
    var SvgMoonStroke = function SvgMoonStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$19({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$$ || (_path$$ = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8.854 2.065c.323.2.52.554.52.935 0 4.086 1.013 6.937 2.85 8.775 1.839 1.838 4.69 2.85 8.776 2.85a1.1 1.1 0 0 1 .985 1.59 10.593 10.593 0 0 1-9.492 5.885C6.643 22.1 1.9 17.357 1.9 11.506c0-4.16 2.4-7.76 5.885-9.491a1.1 1.1 0 0 1 1.069.05ZM7.25 4.95A8.393 8.393 0 1 0 19.049 16.75c-3.511-.287-6.346-1.384-8.38-3.418-2.034-2.034-3.132-4.87-3.418-8.38Z"
      })));
    };

    var _path$_, _path2$h;
    function _extends$18() { _extends$18 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$18.apply(this, arguments); }
    var SvgNarrowStroke = function SvgNarrowStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$18({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$_ || (_path$_ = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M14.64 12.687a1.1 1.1 0 0 1 0-1.375l2-2.5a1.1 1.1 0 1 1 1.718 1.375L16.908 12l1.45 1.812a1.1 1.1 0 0 1-1.718 1.375l-2-2.5ZM9.358 11.313a1.1 1.1 0 0 1 0 1.374l-2 2.5a1.1 1.1 0 0 1-1.718-1.374L7.09 12l-1.45-1.813a1.1 1.1 0 0 1 1.718-1.374l2 2.5Z"
      })), _path2$h || (_path2$h = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 6A3.1 3.1 0 0 1 4 2.9h16A3.1 3.1 0 0 1 23.1 6v12a3.1 3.1 0 0 1-3.1 3.1H4A3.1 3.1 0 0 1 .9 18V6ZM4 5.1a.9.9 0 0 0-.9.9v12a.9.9 0 0 0 .9.9h16a.9.9 0 0 0 .9-.9V6a.9.9 0 0 0-.9-.9H4Z"
      })));
    };

    var _g$9, _defs$b;
    function _extends$17() { _extends$17 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$17.apply(this, arguments); }
    var SvgNewCircleStroke = function SvgNewCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$17({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$9 || (_g$9 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#new-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M9.104 16.5c.691 0 1.104-.393 1.104-1.101V11.24h.05l3.528 4.643c.336.442.647.617 1.116.617.705 0 1.098-.37 1.098-1.041V8.602c0-.709-.406-1.102-1.104-1.102-.692 0-1.104.393-1.104 1.102v4.11h-.05l-3.503-4.595C9.89 7.682 9.573 7.5 9.13 7.5 8.406 7.5 8 7.87 8 8.553v6.845c0 .709.407 1.102 1.105 1.102Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$b || (_defs$b = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "new-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _g$8, _defs$a;
    function _extends$16() { _extends$16 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$16.apply(this, arguments); }
    var SvgPlusCircleStroke = function SvgPlusCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$16({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$8 || (_g$8 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#plus-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M8 10.9a1.1 1.1 0 0 0 0 2.2h2.9V16a1.1 1.1 0 0 0 2.2 0v-2.9H16a1.1 1.1 0 0 0 0-2.2h-2.9V8a1.1 1.1 0 0 0-2.2 0v2.9H8Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM3.1 12a8.9 8.9 0 1 1 17.8 0 8.9 8.9 0 0 1-17.8 0Z"
      }))), _defs$a || (_defs$a = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "plus-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _g$7, _defs$9;
    function _extends$15() { _extends$15 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$15.apply(this, arguments); }
    var SvgPrinterStroke = function SvgPrinterStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$15({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$7 || (_g$7 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#printer-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M19 9.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 15A3.1 3.1 0 0 0 4 18.1h.9V22A1.1 1.1 0 0 0 6 23.1h12a1.1 1.1 0 0 0 1.1-1.1v-3.9h.9a3.1 3.1 0 0 0 3.1-3.1V8A3.1 3.1 0 0 0 20 4.9h-.9V2A1.1 1.1 0 0 0 18 .9H6A1.1 1.1 0 0 0 4.9 2v2.9H4A3.1 3.1 0 0 0 .9 8v7Zm2.2-7a.9.9 0 0 1 .9-.9h16a.9.9 0 0 1 .9.9v7a.9.9 0 0 1-.9.9h-.9V13a1.1 1.1 0 0 0-1.1-1.1H6A1.1 1.1 0 0 0 4.9 13v2.9H4a.9.9 0 0 1-.9-.9V8Zm4-3.1V3.1h9.8v1.8H7.1Zm0 16v-6.8h9.8v6.8H7.1Z"
      }))), _defs$9 || (_defs$9 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "printer-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _g$6, _defs$8;
    function _extends$14() { _extends$14 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$14.apply(this, arguments); }
    var SvgProfileCircleStroke = function SvgProfileCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$14({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$6 || (_g$6 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#profile-circle-stroke_svg__a)",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.9 9.2a4.1 4.1 0 1 1 8.2 0 4.1 4.1 0 0 1-8.2 0ZM12 7.3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM3.1 12a8.9 8.9 0 1 1 16.223 5.06c-.2-.153-.42-.31-.66-.467-1.465-.957-3.67-1.893-6.663-1.893-2.992 0-5.198.936-6.664 1.893-.24.157-.46.314-.659.467A8.86 8.86 0 0 1 3.1 12Zm14.752 6.706A8.866 8.866 0 0 1 12 20.9a8.866 8.866 0 0 1-5.852-2.194c.122-.09.252-.18.39-.27C7.699 17.677 9.493 16.9 12 16.9c2.508 0 4.302.778 5.461 1.535.14.091.27.182.39.271Z"
      }))), _defs$8 || (_defs$8 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "profile-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$Z;
    function _extends$13() { _extends$13 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$13.apply(this, arguments); }
    var SvgProfileStroke = function SvgProfileStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$13({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$Z || (_path$Z = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2.15a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm-2.4 4.6a2.4 2.4 0 1 1 4.8 0 2.4 2.4 0 0 1-4.8 0ZM12 12.65c-4.217 0-6.945 1.913-8.318 3.232-1.029.988-1.165 2.41-.8 3.565l.073.234a3.1 3.1 0 0 0 2.957 2.169h12.177a3.1 3.1 0 0 0 2.956-2.17l.074-.233c.364-1.156.228-2.577-.8-3.564-1.374-1.32-4.101-3.233-8.319-3.233Zm-6.794 4.819C6.299 16.419 8.507 14.85 12 14.85c3.493 0 5.702 1.57 6.794 2.619.28.268.407.744.226 1.317l-.073.234a.9.9 0 0 1-.858.63H5.912a.9.9 0 0 1-.859-.63l-.073-.233c-.18-.573-.053-1.05.226-1.318Z"
      })));
    };

    var _g$5, _defs$7;
    function _extends$12() { _extends$12 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$12.apply(this, arguments); }
    var SvgQuestionCircleStroke = function SvgQuestionCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$12({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$5 || (_g$5 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#question-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.533 13.404c-.102.458-.369.725-.854.725-.581 0-.923-.397-.923-.957v-.096c0-.806.417-1.34 1.223-1.811.882-.527 1.149-.869 1.149-1.497 0-.67-.52-1.135-1.272-1.135-.67 0-1.12.328-1.34.936-.17.438-.478.63-.895.63-.54 0-.875-.336-.875-.855 0-.294.068-.554.205-.814.438-.902 1.531-1.483 3.001-1.483 1.941 0 3.247 1.066 3.247 2.66 0 1.031-.499 1.735-1.463 2.303-.909.526-1.114.82-1.203 1.394ZM12.813 16.098c0 .601-.499 1.073-1.12 1.073-.616 0-1.115-.472-1.115-1.073 0-.602.5-1.074 1.114-1.074.622 0 1.121.472 1.121 1.074Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M23.1 12C23.1 5.87 18.13.9 12 .9S.9 5.87.9 12 5.87 23.1 12 23.1 23.1 18.13 23.1 12ZM12 20.9a8.9 8.9 0 1 1 0-17.8 8.9 8.9 0 0 1 0 17.8Z"
      }))), _defs$7 || (_defs$7 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "question-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$Y, _path2$g;
    function _extends$11() { _extends$11 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$11.apply(this, arguments); }
    var SvgReportStroke = function SvgReportStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$11({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$Y || (_path$Y = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.25 19a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM17 17.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      })), _path2$g || (_path2$g = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M15.972 3.65a3.82 3.82 0 0 0-1.18-1.98C14 .97 12.98.65 12 .65c-.98 0-2 .32-2.792 1.02a3.819 3.819 0 0 0-1.18 1.98H5.826A2.926 2.926 0 0 0 2.9 6.576v13.598A2.926 2.926 0 0 0 5.826 23.1h12.348a2.926 2.926 0 0 0 2.926-2.926V6.576a2.926 2.926 0 0 0-2.926-2.926h-2.202ZM5.1 6.576c0-.4.325-.726.726-.726H6.4v2.9a1.1 1.1 0 0 0 1.1 1.1h9a1.1 1.1 0 0 0 1.1-1.1v-2.9h.574c.401 0 .726.325.726.726v13.598a.726.726 0 0 1-.726.726H5.826a.726.726 0 0 1-.726-.726V6.576Zm8.234-3.259c.313.277.566.72.566 1.433v1.1h1.5v1.8H8.6v-1.8h1.5v-1.1c0-.712.254-1.156.567-1.433C11 3.022 11.48 2.85 12 2.85s1 .172 1.334.467Z"
      })));
    };

    var _g$4, _defs$6;
    function _extends$10() { _extends$10 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$10.apply(this, arguments); }
    var SvgRightCircleStroke = function SvgRightCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$10({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$4 || (_g$4 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#right-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.222 16.278a1.1 1.1 0 0 1 0-1.556l1.622-1.622H7.5a1.1 1.1 0 0 1 0-2.2h6.344l-1.622-1.622a1.1 1.1 0 1 1 1.556-1.556l3.5 3.5a1.1 1.1 0 0 1 0 1.556l-3.5 3.5a1.1 1.1 0 0 1-1.556 0Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 23.1C5.87 23.1.9 18.13.9 12S5.87.9 12 .9 23.1 5.87 23.1 12 18.13 23.1 12 23.1ZM3.1 12a8.9 8.9 0 1 0 17.8 0 8.9 8.9 0 0 0-17.8 0Z"
      }))), _defs$6 || (_defs$6 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "right-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$X, _path2$f;
    function _extends$$() { _extends$$ = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$$.apply(this, arguments); }
    var SvgSettingStroke = function SvgSettingStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$$({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$X || (_path$X = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 8.793a3.228 3.228 0 0 0-3.225 3.225A3.228 3.228 0 0 0 12 15.242a3.228 3.228 0 0 0 3.225-3.225A3.228 3.228 0 0 0 12 8.793Zm-.936 3.225c0-.52.416-.937.936-.937s.936.416.936.937c0 .52-.416.936-.936.936a.932.932 0 0 1-.936-.937Z"
      })), _path2$f || (_path2$f = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20.54 12.018c0 .322-.03.676-.062.957l-.02-.021.613.634a3.222 3.222 0 0 1 .479 3.85l-.073.135a3.223 3.223 0 0 1-3.579 1.518l-.853-.218c-.218.166-.51.364-.77.52-.28.167-.613.323-.873.437l-.24.853a3.22 3.22 0 0 1-3.1 2.34h-.145a3.23 3.23 0 0 1-3.1-2.34l-.24-.843a9.455 9.455 0 0 1-.936-.447 5.118 5.118 0 0 1-.738-.51l-.822.209a3.223 3.223 0 0 1-3.579-1.52l-.073-.135a3.223 3.223 0 0 1 .479-3.849l.614-.634a9.056 9.056 0 0 1-.063-.957c0-.323.031-.677.063-.957l-.614-.635a3.223 3.223 0 0 1-.479-3.849l.073-.135A3.223 3.223 0 0 1 6.081 4.9l.853.22.07-.05c.194-.136.426-.3.658-.43.28-.155.645-.332.915-.457l.25-.863a3.22 3.22 0 0 1 3.1-2.341h.146a3.23 3.23 0 0 1 3.1 2.34l.25.885c.26.125.582.291.853.447.22.128.47.296.677.434l.082.055.884-.218a3.223 3.223 0 0 1 3.579 1.519l.073.135a3.223 3.223 0 0 1-.479 3.849l-.614.634c.032.281.063.635.063.957Zm-2.371-1.062-.02-.093v-.031l-.032-.01a1.15 1.15 0 0 1 .312-.968l.999-1.03a.942.942 0 0 0 .135-1.124l-.073-.135a.93.93 0 0 0-1.04-.437l-1.384.354c-.333.083-.676.02-.946-.177v-.02h-.021l-.073-.053h-.001a13.42 13.42 0 0 1-.26-.177 7.67 7.67 0 0 0-.655-.426 9.09 9.09 0 0 0-.717-.375c-.125-.062-.23-.114-.302-.145l-.083-.052h-.031a1.148 1.148 0 0 1-.625-.729l-.395-1.383a.949.949 0 0 0-.905-.676h-.146c-.426 0-.79.27-.905.676l-.395 1.383a1.173 1.173 0 0 1-.655.75h-.032l-.093.041a2.507 2.507 0 0 1-.13.058c-.058.025-.124.053-.193.088a9.43 9.43 0 0 0-.728.364 5.327 5.327 0 0 0-.708.484l-.114.088-.062.052-.021.02c-.28.22-.645.302-.988.22l-1.384-.354a.93.93 0 0 0-1.04.436l-.073.136a.943.943 0 0 0 .135 1.123l.999 1.03c.25.25.364.614.312.967l-.02.021v.094a5.123 5.123 0 0 1-.01.06c-.01.07-.024.158-.032.252-.032.26-.052.551-.052.75a6.986 6.986 0 0 0 .086.998l.007.062.021.094v.031a1.15 1.15 0 0 1-.312.968l-.999 1.03a.943.943 0 0 0-.135 1.123l.073.135a.93.93 0 0 0 1.04.437l1.384-.354c.364-.093.76 0 1.04.25v.02h.02l.063.053.063.05c.043.037.095.08.156.127l.118.087c.157.118.308.231.433.298.167.093.427.208.697.322.105.044.203.08.28.11l.043.015c.041.02.093.052.093.052h.031c.344.125.604.406.708.76l.395 1.383a.949.949 0 0 0 .905.676h.146c.426 0 .79-.27.905-.676l.395-1.384a1.17 1.17 0 0 1 .676-.759h.032l.083-.031c.083-.031.187-.073.302-.125.25-.104.51-.229.686-.333.167-.094.395-.26.604-.416.104-.073.187-.135.25-.187l.072-.052.02-.021c.282-.219.656-.302 1-.219l1.383.354a.93.93 0 0 0 1.04-.437l.073-.135a.942.942 0 0 0-.135-1.124l-.999-1.03a1.14 1.14 0 0 1-.312-.967l.02-.02v-.094c.004-.018.007-.039.01-.061.01-.069.025-.157.033-.252.03-.26.052-.55.052-.748a6.986 6.986 0 0 0-.087-1l-.007-.062Z"
      })));
    };

    var _path$W;
    function _extends$_() { _extends$_ = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$_.apply(this, arguments); }
    var SvgStarStroke = function SvgStarStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$_({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$W || (_path$W = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.018 2.683c.78-1.69 3.184-1.69 3.964 0l1.98 4.29 4.761.68c1.781.255 2.507 2.434 1.235 3.706l-3.407 3.407 1.04 5.199c.361 1.811-1.55 3.226-3.177 2.35L12 19.938l-4.415 2.377c-1.626.876-3.538-.539-3.175-2.35l1.04-5.199-3.408-3.407c-1.272-1.272-.546-3.45 1.235-3.705l4.76-.68 1.98-4.29ZM12 3.725 9.813 8.463a1.118 1.118 0 0 1-.857.639l-5.258.75 3.756 3.756c.264.264.379.643.306 1.01l-1.135 5.675 4.845-2.61c.33-.177.73-.177 1.06 0l4.845 2.61-1.135-5.675a1.118 1.118 0 0 1 .306-1.01l3.755-3.755-5.257-.751a1.118 1.118 0 0 1-.857-.639L12 3.725Z"
      })));
    };

    var _path$V;
    function _extends$Z() { _extends$Z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$Z.apply(this, arguments); }
    var SvgStoreStroke = function SvgStoreStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$Z({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$V || (_path$V = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "m23.1 7-.14-.538-1.67-2.977A3.1 3.1 0 0 0 18.588 1.9H5.413A3.1 3.1 0 0 0 2.71 3.485L1.04 6.462.9 7v1.143a4 4 0 0 0 1 2.652V19A3.1 3.1 0 0 0 5 22.1h7a1.1 1.1 0 0 0 1.1-1.1v-4.9h2.8V21a1.1 1.1 0 0 0 1.1 1.1h2a3.1 3.1 0 0 0 3.1-3.1v-8.205a4 4 0 0 0 1-2.652V7ZM3.877 5.9l.751-1.34a.9.9 0 0 1 .785-.46h13.174a.9.9 0 0 1 .785.46l.75 1.34H3.878Zm2.579 2.2c0 1-.78 1.8-1.678 1.8C3.88 9.9 3.1 9.1 3.1 8.1h3.356Zm7.222 0c0 1-.78 1.8-1.678 1.8-.898 0-1.678-.8-1.678-1.8h3.356Zm7.222 0c0 1-.78 1.8-1.678 1.8-.897 0-1.678-.8-1.678-1.8H20.9Zm-5.289 1.485c.561 1.461 1.95 2.515 3.611 2.515.232 0 .458-.02.678-.06V19a.9.9 0 0 1-.9.9h-.9V15a1.1 1.1 0 0 0-1.1-1.1h-5a1.1 1.1 0 0 0-1.1 1.1v4.9H5a.9.9 0 0 1-.9-.9v-6.96c.22.04.446.06.678.06 1.66 0 3.05-1.054 3.611-2.515C8.95 11.046 10.339 12.1 12 12.1c1.66 0 3.05-1.054 3.611-2.515Z"
      })));
    };

    var _g$3, _defs$5;
    function _extends$Y() { _extends$Y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$Y.apply(this, arguments); }
    var SvgSunStroke = function SvgSunStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$Y({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$3 || (_g$3 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#sun-stroke_svg__a)",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 8.1a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8ZM5.9 12a6.1 6.1 0 1 1 12.2 0 6.1 6.1 0 0 1-12.2 0ZM12 4.1A1.1 1.1 0 0 1 10.9 3V2a1.1 1.1 0 0 1 2.2 0v1A1.1 1.1 0 0 1 12 4.1ZM12 23.1a1.1 1.1 0 0 1-1.1-1.1v-1a1.1 1.1 0 0 1 2.2 0v1a1.1 1.1 0 0 1-1.1 1.1ZM17.586 6.414a1.1 1.1 0 0 1 0-1.556l.707-.707a1.1 1.1 0 0 1 1.556 1.556l-.707.707a1.1 1.1 0 0 1-1.556 0ZM4.151 19.849a1.1 1.1 0 0 1 0-1.556l.707-.707a1.1 1.1 0 0 1 1.556 1.556l-.707.707a1.1 1.1 0 0 1-1.556 0ZM17.586 17.586a1.1 1.1 0 0 1 1.556 0l.707.707a1.1 1.1 0 1 1-1.556 1.556l-.707-.707a1.1 1.1 0 0 1 0-1.556ZM4.151 4.151a1.1 1.1 0 0 1 1.556 0l.707.707a1.1 1.1 0 1 1-1.556 1.556l-.707-.707a1.1 1.1 0 0 1 0-1.556ZM19.9 12a1.1 1.1 0 0 1 1.1-1.1h1a1.1 1.1 0 0 1 0 2.2h-1a1.1 1.1 0 0 1-1.1-1.1ZM.9 12A1.1 1.1 0 0 1 2 10.9h1a1.1 1.1 0 0 1 0 2.2H2A1.1 1.1 0 0 1 .9 12Z"
      }))), _defs$5 || (_defs$5 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "sun-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$U;
    function _extends$X() { _extends$X = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$X.apply(this, arguments); }
    var SvgThumbupStroke = function SvgThumbupStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$X({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$U || (_path$U = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.836 2.68c.556-.225 1.171-.28 1.671-.28.908 0 1.623.39 2.062 1.045.392.586.49 1.275.49 1.816v3.665h3.112a3.1 3.1 0 0 1 3.064 3.568l-1.045 6.84v.001a2.672 2.672 0 0 1-2.648 2.265H3.5a1.1 1.1 0 0 1-1.1-1.1v-9a1.1 1.1 0 0 1 1.1-1.1h3.454c.551-.93 1.085-2.144 1.526-3.297.534-1.392.89-2.577.958-2.868.198-.846.816-1.32 1.398-1.555Zm.738 2.083c-.11.45-.498 1.716-1.04 3.127-.504 1.317-1.178 2.862-1.934 4.031V19.4h8.942c.246 0 .44-.176.472-.394v-.002l1.047-6.842a.9.9 0 0 0-.89-1.036H14.96a2.1 2.1 0 0 1-2.1-2.1V5.261c0-.321-.066-.513-.12-.592-.018-.027-.029-.034-.037-.038a.435.435 0 0 0-.196-.031c-.375 0-.667.047-.845.119a.498.498 0 0 0-.088.044ZM4.6 12.6v6.8h1.8v-6.8H4.6Z"
      })));
    };

    var _path$T, _path2$e;
    function _extends$W() { _extends$W = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$W.apply(this, arguments); }
    var SvgTicketStroke = function SvgTicketStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$W({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$T || (_path$T = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.5 10.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM7.75 15a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
      })), _path2$e || (_path2$e = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 3.4A1.1 1.1 0 0 0 .9 4.5v15A1.1 1.1 0 0 0 2 20.6h3.684a1.1 1.1 0 0 0 .668-.226l1.437-1.097 1.438 1.097a1.1 1.1 0 0 0 .668.226H22a1.1 1.1 0 0 0 1.1-1.1v-15A1.1 1.1 0 0 0 22 3.4H9.895a1.1 1.1 0 0 0-.668.226L7.79 4.723 6.352 3.626a1.1 1.1 0 0 0-.668-.226H2Zm3.312 2.2 1.81 1.382c.394.3.94.3 1.335 0l1.81-1.382H20.9v12.8H10.267l-1.81-1.381a1.1 1.1 0 0 0-1.335 0L5.312 18.4H3.1V5.6h2.212Z"
      })));
    };

    var _path$S, _path2$d;
    function _extends$V() { _extends$V = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$V.apply(this, arguments); }
    var SvgTimeStroke = function SvgTimeStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$V({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$S || (_path$S = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 6.4a1.1 1.1 0 0 1 1.1 1.1v4.485l2.604 2.17a1.1 1.1 0 1 1-1.408 1.69l-3-2.5a1.1 1.1 0 0 1-.396-.845v-5A1.1 1.1 0 0 1 12 6.4Z"
      })), _path2$d || (_path2$d = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.4 12C1.4 6.146 6.146 1.4 12 1.4c5.854 0 10.6 4.746 10.6 10.6 0 5.854-4.746 10.6-10.6 10.6-5.854 0-10.6-4.746-10.6-10.6ZM12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Z"
      })));
    };

    var _path$R, _path2$c;
    function _extends$U() { _extends$U = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$U.apply(this, arguments); }
    var SvgTrashStroke = function SvgTrashStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$U({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$R || (_path$R = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M14.841 1.5a1 1 0 0 0-.41.088L11.293 3H4.5a1 1 0 1 0 0 2h15a1 1 0 0 0 1-1V2.5a1 1 0 0 0-1-1H14.84ZM10.25 12.15a1.1 1.1 0 0 1 1.1 1.1v3a1.1 1.1 0 0 1-2.2 0v-3a1.1 1.1 0 0 1 1.1-1.1ZM14.85 13.25a1.1 1.1 0 0 0-2.2 0v3a1.1 1.1 0 0 0 2.2 0v-3Z"
      })), _path2$c || (_path2$c = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.5 5.9a1.1 1.1 0 0 0-1.095 1.203l1.244 13.273A3.005 3.005 0 0 0 7.641 23.1h8.718c1.55 0 2.847-1.18 2.992-2.724l1.244-13.273A1.1 1.1 0 0 0 19.5 5.9h-15Zm2.34 14.27L5.707 8.1h12.584L17.16 20.17a.805.805 0 0 1-.8.73H7.64a.805.805 0 0 1-.8-.73Z"
      })));
    };

    var _g$2, _defs$4;
    function _extends$T() { _extends$T = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$T.apply(this, arguments); }
    var SvgUpCircleStroke = function SvgUpCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$T({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$2 || (_g$2 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#up-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.278 11.778a1.1 1.1 0 0 1-1.556 0L13.1 10.156V16.5a1.1 1.1 0 0 1-2.2 0v-6.344l-1.622 1.622a1.1 1.1 0 1 1-1.556-1.556l3.5-3.5a1.1 1.1 0 0 1 1.556 0l3.5 3.5a1.1 1.1 0 0 1 0 1.556Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$4 || (_defs$4 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "up-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$Q;
    function _extends$S() { _extends$S = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$S.apply(this, arguments); }
    var SvgViewColumnsStroke = function SvgViewColumnsStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$S({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$Q || (_path$Q = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 5.625C2 4.451 2.951 3.5 4.125 3.5h15.75C21.049 3.5 22 4.451 22 5.625v12.75a2.125 2.125 0 0 1-2.125 2.125H4.125A2.125 2.125 0 0 1 2 18.375V5.625ZM10 18.5h4v-13h-4v13Zm-2-13v13H4.125A.125.125 0 0 1 4 18.375V5.625c0-.069.056-.125.125-.125H8Zm8 0v13h3.875a.125.125 0 0 0 .125-.125V5.625a.125.125 0 0 0-.125-.125H16Z"
      })));
    };

    var _g$1, _defs$3;
    function _extends$R() { _extends$R = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$R.apply(this, arguments); }
    var SvgWarningCircleStroke = function SvgWarningCircleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$R({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g$1 || (_g$1 = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#warning-circle-stroke_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.066 12.755c-.02.704-.376 1.114-1.066 1.114-.697 0-1.046-.41-1.066-1.114l-.13-4.252c0-.058-.002-.119-.004-.177v-.02a4.572 4.572 0 0 1-.003-.124c0-.76.45-1.203 1.21-1.203.752 0 1.196.444 1.196 1.203 0 .089-.007.212-.014.32l-.123 4.253ZM13.292 15.995c0 .69-.581 1.23-1.292 1.23-.718 0-1.299-.54-1.299-1.23 0-.683.581-1.223 1.299-1.223.71 0 1.292.54 1.292 1.223Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M.9 12C.9 5.87 5.87.9 12 .9S23.1 5.87 23.1 12 18.13 23.1 12 23.1.9 18.13.9 12ZM12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z"
      }))), _defs$3 || (_defs$3 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "warning-circle-stroke_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$P, _path2$b;
    function _extends$Q() { _extends$Q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$Q.apply(this, arguments); }
    var SvgWarningTriangleStroke = function SvgWarningTriangleStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$Q({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$P || (_path$P = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.067 14.276c-.02.704-.376 1.115-1.067 1.115-.697 0-1.046-.41-1.066-1.115l-.13-4.252c0-.057-.002-.118-.004-.176v-.02a4.23 4.23 0 0 1-.003-.125c0-.759.451-1.203 1.21-1.203.752 0 1.196.444 1.196 1.203 0 .089-.006.212-.013.321l-.123 4.252ZM13.292 17.517c0 .69-.58 1.23-1.292 1.23-.718 0-1.299-.54-1.299-1.23 0-.684.581-1.224 1.3-1.224.71 0 1.291.54 1.291 1.224Z"
      })), _path2$b || (_path2$b = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M11.585 1.9a2.1 2.1 0 0 0-1.83 1.07L1.308 17.986a2.1 2.1 0 0 0-.028 2.008l.518.984A2.1 2.1 0 0 0 3.657 22.1h16.687a2.1 2.1 0 0 0 1.858-1.122l.518-.984a2.1 2.1 0 0 0-.028-2.008L14.246 2.97a2.1 2.1 0 0 0-1.83-1.07h-.831ZM3.252 19.017 11.644 4.1h.713l8.39 14.917-.464.883H3.717l-.465-.883Z"
      })));
    };

    var _path$O, _path2$a;
    function _extends$P() { _extends$P = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$P.apply(this, arguments); }
    var SvgWideStroke = function SvgWideStroke(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$P({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$O || (_path$O = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5.141 12.687a1.1 1.1 0 0 1 0-1.374l2-2.5a1.1 1.1 0 1 1 1.718 1.374L7.409 12l1.45 1.813a1.1 1.1 0 1 1-1.718 1.374l-2-2.5ZM16.859 15.187l2-2.5a1.1 1.1 0 0 0 0-1.374l-2-2.5a1.1 1.1 0 0 0-1.718 1.374L16.59 12l-1.45 1.813a1.1 1.1 0 0 0 1.718 1.374Z"
      })), _path2$a || (_path2$a = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4 2.9A3.1 3.1 0 0 0 .9 6v12A3.1 3.1 0 0 0 4 21.1h16a3.1 3.1 0 0 0 3.1-3.1V6A3.1 3.1 0 0 0 20 2.9H4ZM3.1 6a.9.9 0 0 1 .9-.9h16a.9.9 0 0 1 .9.9v12a.9.9 0 0 1-.9.9H4a.9.9 0 0 1-.9-.9V6Z"
      })));
    };

    var _path$N;
    function _extends$O() { _extends$O = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$O.apply(this, arguments); }
    var SvgAdjust = function SvgAdjust(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$O({
        width: "1em",
        height: "1em",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$N || (_path$N = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M4 9V2.5M4 9a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 2.5V11m8-2V2.5M12 9a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 2.5V11M8 5V2.5M8 5a1 1 0 0 1 0 2m0-2a1 1 0 1 0 0 2m0 6.5V7",
        stroke: "currentColor",
        strokeWidth: 1.467,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })));
    };

    var _path$M;
    function _extends$N() { _extends$N = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$N.apply(this, arguments); }
    var SvgArrowDown = function SvgArrowDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$N({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$M || (_path$M = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M4.878 12.322a1.1 1.1 0 1 0-1.556 1.556l8 8a1.1 1.1 0 0 0 1.556 0l8-8a1.1 1.1 0 1 0-1.556-1.556L13.2 18.444V3.1a1.1 1.1 0 0 0-2.2 0v15.344l-6.122-6.122Z"
      })));
    };

    var _path$L;
    function _extends$M() { _extends$M = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$M.apply(this, arguments); }
    var SvgArrowLeft = function SvgArrowLeft(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$M({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$L || (_path$L = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M11.778 4.778a1.1 1.1 0 1 0-1.556-1.556l-8 8a1.1 1.1 0 0 0 0 1.556l8 8a1.1 1.1 0 1 0 1.556-1.556L5.656 13.1H21a1.1 1.1 0 0 0 0-2.2H5.656l6.122-6.122Z"
      })));
    };

    var _path$K;
    function _extends$L() { _extends$L = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$L.apply(this, arguments); }
    var SvgArrowOut = function SvgArrowOut(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$L({
        width: "1em",
        height: "1em",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$K || (_path$K = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M2.5 13.5v-3m0 3h3m-3 0 4.166-4.167M13.5 2.5h-3m3 0v3m0-3L9.333 6.667",
        stroke: "currentColor",
        strokeWidth: 1.467,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })));
    };

    var _path$J;
    function _extends$K() { _extends$K = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$K.apply(this, arguments); }
    var SvgArrowIn = function SvgArrowIn(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$K({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$J || (_path$J = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M21.028 2.972a1.1 1.1 0 0 1 0 1.556L16.656 8.9H18.5a1.1 1.1 0 0 1 0 2.2H14a1.1 1.1 0 0 1-1.1-1.1V5.5a1.1 1.1 0 0 1 2.2 0v1.844l4.372-4.372a1.1 1.1 0 0 1 1.556 0ZM4.4 14a1.1 1.1 0 0 1 1.1-1.1H10a1.1 1.1 0 0 1 1.1 1.1v4.5a1.1 1.1 0 0 1-2.2 0v-1.844l-4.372 4.372a1.1 1.1 0 1 1-1.556-1.556L7.344 15.1H5.5A1.1 1.1 0 0 1 4.4 14Z"
      })));
    };

    var _path$I;
    function _extends$J() { _extends$J = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$J.apply(this, arguments); }
    var SvgArrowRight = function SvgArrowRight(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$J({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$I || (_path$I = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.222 19.222a1.1 1.1 0 1 0 1.556 1.556l8-8a1.1 1.1 0 0 0 0-1.556l-8-8a1.1 1.1 0 1 0-1.556 1.556l6.122 6.122H3a1.1 1.1 0 0 0 0 2.2h15.344l-6.122 6.122Z"
      })));
    };

    var _path$H;
    function _extends$I() { _extends$I = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$I.apply(this, arguments); }
    var SvgArrowUp = function SvgArrowUp(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$I({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$H || (_path$H = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M19.222 11.778a1.1 1.1 0 1 0 1.556-1.556l-8-8a1.1 1.1 0 0 0-1.556 0l-8 8a1.1 1.1 0 1 0 1.556 1.556L10.9 5.656V21a1.1 1.1 0 0 0 2.2 0V5.656l6.122 6.122Z"
      })));
    };

    var _path$G;
    function _extends$H() { _extends$H = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$H.apply(this, arguments); }
    var SvgBars = function SvgBars(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$H({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$G || (_path$G = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M3 5a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM2.9 12A1.1 1.1 0 0 1 4 10.9h16a1.1 1.1 0 0 1 0 2.2H4A1.1 1.1 0 0 1 2.9 12ZM4 17.9a1.1 1.1 0 0 0 0 2.2h16a1.1 1.1 0 0 0 0-2.2H4Z"
      })));
    };

    var _path$F;
    function _extends$G() { _extends$G = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$G.apply(this, arguments); }
    var SvgBlock = function SvgBlock(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$G({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$F || (_path$F = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 1.4C6.146 1.4 1.4 6.146 1.4 12c0 5.854 4.746 10.6 10.6 10.6 5.854 0 10.6-4.746 10.6-10.6 0-5.854-4.746-10.6-10.6-10.6ZM3.6 12a8.4 8.4 0 0 1 13.511-6.667L5.333 17.111A8.363 8.363 0 0 1 3.6 12Zm16.8 0a8.4 8.4 0 0 1-13.51 6.667L18.666 6.889A8.363 8.363 0 0 1 20.4 12Z"
      })));
    };

    var _path$E;
    function _extends$F() { _extends$F = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$F.apply(this, arguments); }
    var SvgCheck = function SvgCheck(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$F({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$E || (_path$E = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M22.278 7.278a1.1 1.1 0 1 0-1.556-1.556L10 16.444l-6.222-6.222a1.1 1.1 0 0 0-1.556 1.556l7 7a1.1 1.1 0 0 0 1.556 0l11.5-11.5Z"
      })));
    };

    var _path$D;
    function _extends$E() { _extends$E = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$E.apply(this, arguments); }
    var SvgChevronDown = function SvgChevronDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$E({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$D || (_path$D = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M4.778 7.722a1.1 1.1 0 0 0-1.556 1.556l8 8a1.1 1.1 0 0 0 1.556 0l8-8a1.1 1.1 0 1 0-1.556-1.556L12 14.944 4.778 7.722Z"
      })));
    };

    var _path$C;
    function _extends$D() { _extends$D = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$D.apply(this, arguments); }
    var SvgChevronLeft = function SvgChevronLeft(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$D({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$C || (_path$C = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.278 4.778a1.1 1.1 0 1 0-1.556-1.556l-8 8a1.1 1.1 0 0 0 0 1.556l8 8a1.1 1.1 0 1 0 1.556-1.556L9.056 12l7.222-7.222Z"
      })));
    };

    var _path$B;
    function _extends$C() { _extends$C = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$C.apply(this, arguments); }
    var SvgChevronRight = function SvgChevronRight(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$C({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$B || (_path$B = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M9.278 20.778a1.1 1.1 0 1 1-1.556-1.556L14.944 12 7.722 4.778a1.1 1.1 0 1 1 1.556-1.556l8 8a1.1 1.1 0 0 1 0 1.556l-8 8Z"
      })));
    };

    var _path$A;
    function _extends$B() { _extends$B = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$B.apply(this, arguments); }
    var SvgChevronUp = function SvgChevronUp(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$B({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$A || (_path$A = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M19.222 17.278a1.1 1.1 0 1 0 1.556-1.556l-8-8a1.1 1.1 0 0 0-1.556 0l-8 8a1.1 1.1 0 1 0 1.556 1.556L12 10.056l7.222 7.222Z"
      })));
    };

    var _path$z;
    function _extends$A() { _extends$A = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$A.apply(this, arguments); }
    var SvgCircleCheck = function SvgCircleCheck(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$A({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$z || (_path$z = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5Zm5.322 6.422a1.1 1.1 0 0 1 1.556 1.556l-7.5 7.5a1.1 1.1 0 0 1-1.556 0l-4.5-4.5a1.1 1.1 0 1 1 1.556-1.556l3.722 3.722 6.722-6.722Z"
      })));
    };

    var _path$y;
    function _extends$z() { _extends$z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$z.apply(this, arguments); }
    var SvgCircleEmpty = function SvgCircleEmpty(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$z({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$y || (_path$y = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5Zm0-18.8a8.3 8.3 0 1 1 0 16.6 8.3 8.3 0 0 1 0-16.6Z"
      })));
    };

    var _path$x, _path2$9;
    function _extends$y() { _extends$y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$y.apply(this, arguments); }
    var SvgClips = function SvgClips(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$y({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$x || (_path$x = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M3.506 5.26a4.6 4.6 0 0 0 0 6.506l2.207 2.207a1.1 1.1 0 1 0 1.556-1.556L5.062 10.21a2.4 2.4 0 0 1 0-3.394l1.754-1.754a2.4 2.4 0 0 1 3.394 0l2.207 2.207a1.1 1.1 0 0 0 1.556-1.556l-2.207-2.207a4.6 4.6 0 0 0-6.505 0L3.506 5.261ZM11.511 16.66a1.1 1.1 0 1 0-1.555 1.556l2.035 2.035a4.6 4.6 0 0 0 6.506 0l1.754-1.755a4.6 4.6 0 0 0 0-6.505l-2.035-2.035a1.1 1.1 0 1 0-1.556 1.555l2.036 2.036a2.4 2.4 0 0 1 0 3.394l-1.755 1.755a2.4 2.4 0 0 1-3.394 0L11.51 16.66Z"
      })), _path2$9 || (_path2$9 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M11.414 9.686a1.1 1.1 0 1 0-1.556 1.556l2.829 2.828a1.1 1.1 0 0 0 1.555-1.555l-2.828-2.829Z"
      })));
    };

    var _path$w;
    function _extends$x() { _extends$x = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$x.apply(this, arguments); }
    var SvgClose = function SvgClose(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$x({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$w || (_path$w = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M3.222 3.222a1.1 1.1 0 0 1 1.556 0L12 10.444l7.222-7.222a1.1 1.1 0 1 1 1.556 1.556L13.556 12l7.222 7.222a1.1 1.1 0 1 1-1.556 1.556L12 13.556l-7.222 7.222a1.1 1.1 0 1 1-1.556-1.556L10.444 12 3.222 4.778a1.1 1.1 0 0 1 0-1.556Z"
      })));
    };

    var _path$v;
    function _extends$w() { _extends$w = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$w.apply(this, arguments); }
    var SvgCompress = function SvgCompress(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$w({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$v || (_path$v = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6 1h12a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm6 3a1 1 0 0 1 1 1v2.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L11 7.586V5a1 1 0 0 1 1-1ZM8.293 16.293l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L13 16.414V19a1 1 0 1 1-2 0v-2.586l-1.293 1.293a1 1 0 0 1-1.414-1.414ZM5 22a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
      })));
    };

    var _path$u;
    function _extends$v() { _extends$v = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$v.apply(this, arguments); }
    var SvgDots = function SvgDots(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$v({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$u || (_path$u = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM17.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      })));
    };

    var _path$t, _path2$8;
    function _extends$u() { _extends$u = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$u.apply(this, arguments); }
    var SvgDownload = function SvgDownload(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$u({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$t || (_path$t = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.1 4a1.1 1.1 0 0 0-2.2 0v8.108l-1.684-1.443a1.1 1.1 0 0 0-1.432 1.67l3.5 3a1.1 1.1 0 0 0 1.432 0l3.5-3a1.1 1.1 0 1 0-1.432-1.67L13.1 12.108V4Z"
      })), _path2$8 || (_path2$8 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M4 12.9A1.1 1.1 0 0 1 5.1 14v4a.9.9 0 0 0 .9.9h12a.9.9 0 0 0 .9-.9v-4a1.1 1.1 0 0 1 2.2 0v4a3.1 3.1 0 0 1-3.1 3.1H6A3.1 3.1 0 0 1 2.9 18v-4A1.1 1.1 0 0 1 4 12.9Z"
      })));
    };

    var _path$s;
    function _extends$t() { _extends$t = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$t.apply(this, arguments); }
    var SvgExchange = function SvgExchange(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$t({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$s || (_path$s = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.778 3.722a1.1 1.1 0 0 1 0 1.556L5.656 6.4H20a1.1 1.1 0 0 1 0 2.2H5.656l1.122 1.122a1.1 1.1 0 1 1-1.556 1.556l-3-3a1.1 1.1 0 0 1 0-1.556l3-3a1.1 1.1 0 0 1 1.556 0ZM17.222 12.722a1.1 1.1 0 0 1 1.556 0l3 3a1.1 1.1 0 0 1 0 1.556l-3 3a1.1 1.1 0 1 1-1.556-1.556l1.122-1.122H4a1.1 1.1 0 0 1 0-2.2h14.344l-1.122-1.122a1.1 1.1 0 0 1 0-1.556Z"
      })));
    };

    var _path$r;
    function _extends$s() { _extends$s = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$s.apply(this, arguments); }
    var SvgExpand = function SvgExpand(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$s({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$r || (_path$r = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6 1h12a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm5.293 3.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L13 7.414V10a1 1 0 1 1-2 0V7.414L9.707 8.707a1 1 0 0 1-1.414-1.414l3-3ZM11 16.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L13 16.586V14a1 1 0 1 0-2 0v2.586ZM5 22a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
      })));
    };

    var _path$q;
    function _extends$r() { _extends$r = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$r.apply(this, arguments); }
    var SvgFrozen = function SvgFrozen(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$r({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$q || (_path$q = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M10.637 2.103a1.1 1.1 0 1 0-1.274 1.794l1.648 1.17v5.221L6.841 7.88l-.567-2.368a1.1 1.1 0 0 0-2.14.511l.42 1.757-1.604.381a1.1 1.1 0 1 0 .508 2.14l2.251-.534L9.8 12.13l-3.946 2.278-2.334-.694a1.1 1.1 0 0 0-.626 2.11l1.731.514-.472 1.58a1.1 1.1 0 0 0 2.108.63l.662-2.217 4.09-2.36v4.557L9.242 20.2a1.1 1.1 0 0 0 1.513 1.598l1.312-1.243 1.132 1.2a1.1 1.1 0 1 0 1.6-1.511l-1.589-1.682v-4.464l4.217 2.434.277 1.86a1.1 1.1 0 1 0 2.176-.323l-.233-1.568 1.603-.734a1.1 1.1 0 0 0-.916-2l-1.839.841-4.296-2.48 4.441-2.564 1.75.69a1.1 1.1 0 0 0 .807-2.046l-1.474-.582.166-1.756a1.1 1.1 0 0 0-2.19-.206l-.19 2.013-4.299 2.481V5.031l1.473-1.17a1.1 1.1 0 1 0-1.368-1.722l-1.242.986-1.437-1.022Z"
      })));
    };

    var _path$p;
    function _extends$q() { _extends$q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$q.apply(this, arguments); }
    var SvgHandle = function SvgHandle(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$q({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$p || (_path$p = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5 8.7a1.1 1.1 0 0 1 1.1-1.1h11.8a1.1 1.1 0 0 1 0 2.2H6.1A1.1 1.1 0 0 1 5 8.7ZM5 15.3a1.1 1.1 0 0 1 1.1-1.1h11.8a1.1 1.1 0 1 1 0 2.2H6.1A1.1 1.1 0 0 1 5 15.3Z"
      })));
    };

    var _path$o;
    function _extends$p() { _extends$p = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$p.apply(this, arguments); }
    var SvgLimitDown = function SvgLimitDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$p({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$o || (_path$o = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.222 11.222a1.1 1.1 0 0 1 1.556 0l3.122 3.122V3a1.1 1.1 0 0 1 2.2 0v11.344l3.122-3.122a1.1 1.1 0 1 1 1.556 1.556l-5 5a1.1 1.1 0 0 1-1.556 0l-5-5a1.1 1.1 0 0 1 0-1.556ZM18.1 21a1.1 1.1 0 0 1-1.1 1.1H7a1.1 1.1 0 0 1 0-2.2h10a1.1 1.1 0 0 1 1.1 1.1Z"
      })));
    };

    var _path$n;
    function _extends$o() { _extends$o = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$o.apply(this, arguments); }
    var SvgLimitLeft = function SvgLimitLeft(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$o({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$n || (_path$n = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7 19.1A1.1 1.1 0 0 1 5.9 18V6a1.1 1.1 0 0 1 2.2 0v12A1.1 1.1 0 0 1 7 19.1ZM17.778 6.778 12.556 12l5.222 5.222a1.1 1.1 0 1 1-1.556 1.556l-6-6a1.1 1.1 0 0 1 0-1.556l6-6a1.1 1.1 0 1 1 1.556 1.556Z"
      })));
    };

    var _path$m;
    function _extends$n() { _extends$n = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$n.apply(this, arguments); }
    var SvgLimitRight = function SvgLimitRight(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$n({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$m || (_path$m = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.222 18.778a1.1 1.1 0 0 1 0-1.556L11.444 12 6.222 6.778a1.1 1.1 0 1 1 1.556-1.556l6 6a1.1 1.1 0 0 1 0 1.556l-6 6a1.1 1.1 0 0 1-1.556 0ZM17 5a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z"
      })));
    };

    var _path$l;
    function _extends$m() { _extends$m = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$m.apply(this, arguments); }
    var SvgLimitUp = function SvgLimitUp(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$m({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$l || (_path$l = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M5.9 3A1.1 1.1 0 0 1 7 1.9h10a1.1 1.1 0 0 1 0 2.2H7A1.1 1.1 0 0 1 5.9 3ZM16.222 12.778 13.1 9.656V21a1.1 1.1 0 0 1-2.2 0V9.656l-3.122 3.122a1.1 1.1 0 1 1-1.556-1.556l5-5a1.1 1.1 0 0 1 1.556 0l5 5a1.1 1.1 0 1 1-1.556 1.556Z"
      })));
    };

    var _path$k, _path2$7;
    function _extends$l() { _extends$l = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$l.apply(this, arguments); }
    var SvgLine = function SvgLine(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$l({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$k || (_path$k = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M11.251 13.011c-.125 0-.142-.14-.142-.14V9.701c.017-.141.142-.141.142-.141h.515a.171.171 0 0 1 .13.083l.003.004.003.004 1.429 1.932V9.702c0-.117.142-.141.142-.141h.51c.114 0 .142.141.142.141v3.168c0 .116-.142.141-.142.141h-.51c-.076 0-.117-.059-.117-.059l-1.454-1.963v1.881c0 .122-.141.141-.141.141h-.51ZM9.962 9.56h.531a.137.137 0 0 1 .12.142c-.002 0 .003 3.168.003 3.168a.127.127 0 0 1-.123.141h-.531s-.142-.017-.142-.141V9.702s.02-.141.142-.141ZM7.847 9.702c0-.112-.12-.141-.12-.141h-.532c-.125 0-.142.141-.142.141v3.168c0 .125.142.141.142.141h2.038c.12 0 .141-.141.141-.141v-.532c0-.12-.141-.12-.141-.12H7.847V9.702ZM14.626 9.702c.02-.141.141-.141.141-.141h2.038s.142.027.142.141v.539s-.039.113-.142.113H15.42v.535h1.386s.127.015.142.142v.51s-.022.142-.142.142H15.42v.535h1.386s.126.016.142.142v.51s-.019.141-.142.141h-2.038s-.141-.011-.141-.141V9.702Z"
      })), _path2$7 || (_path2$7 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6.3 2A4.3 4.3 0 0 0 2 6.3v11.4A4.3 4.3 0 0 0 6.3 22h11.4a4.3 4.3 0 0 0 4.3-4.3V6.3A4.3 4.3 0 0 0 17.7 2H6.3Zm5.57 3.213c4.412 0 7.383 2.884 7.383 5.923.102 2.924-3.165 5.212-4.526 6.165-.22.154-.392.274-.49.355-.71.477-2.014 1.275-2.315 1.38-.28.104-.639.198-.622-.224.008-.103.034-.252.063-.413.047-.26.1-.554.087-.743 0-.295-.036-.542-.69-.676-3.448-.45-6.104-2.86-6.104-5.85 0-3.49 3.559-5.917 7.214-5.917Z"
      })));
    };

    var _path$j;
    function _extends$k() { _extends$k = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$k.apply(this, arguments); }
    var SvgList = function SvgList(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$k({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$j || (_path$j = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 6A1.1 1.1 0 0 1 9 4.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 6ZM6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 12A1.1 1.1 0 0 1 9 10.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 12ZM6 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.9 18A1.1 1.1 0 0 1 9 16.9h11a1.1 1.1 0 0 1 0 2.2H9A1.1 1.1 0 0 1 7.9 18Z"
      })));
    };

    var _path$i, _path2$6, _path3$1, _defs$2;
    function _extends$j() { _extends$j = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$j.apply(this, arguments); }
    var SvgLoadingLight = function SvgLoadingLight(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$j({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$i || (_path$i = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 22.5A10.5 10.5 0 0 0 22.5 12H24a12 12 0 0 1-24 0h1.5A10.5 10.5 0 0 0 12 22.5Z",
        fill: "url(#loading-light_svg__a)"
      })), _path2$6 || (_path2$6 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22.5 12a10.5 10.5 0 1 0-21 0H0a12 12 0 1 1 24 0h-1.5Z",
        fill: "url(#loading-light_svg__b)"
      })), _path3$1 || (_path3$1 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M23.242 12.984a.75.75 0 0 1-.743-.757v-.22a.75.75 0 0 1 1.5-.015v.25a.75.75 0 0 1-.757.742Z",
        fill: "#000"
      })), _defs$2 || (_defs$2 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("linearGradient", {
        id: "loading-light_svg__a",
        x1: 23.249,
        y1: 23.25,
        x2: 0.75,
        y2: 23.25,
        gradientUnits: "userSpaceOnUse"
      }, /*#__PURE__*/React__namespace.createElement("stop", {
        stopOpacity: 0
      }), /*#__PURE__*/React__namespace.createElement("stop", {
        offset: 1,
        stopOpacity: 0.5
      })), /*#__PURE__*/React__namespace.createElement("linearGradient", {
        id: "loading-light_svg__b",
        x1: 23.249,
        y1: 12,
        x2: 0.75,
        y2: 12,
        gradientUnits: "userSpaceOnUse"
      }, /*#__PURE__*/React__namespace.createElement("stop", null), /*#__PURE__*/React__namespace.createElement("stop", {
        offset: 1,
        stopOpacity: 0.5
      })))));
    };

    var _path$h, _path2$5, _path3, _defs$1;
    function _extends$i() { _extends$i = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }
    var SvgLoadingDark = function SvgLoadingDark(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$i({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$h || (_path$h = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 22.5A10.5 10.5 0 0 0 22.5 12H24a12 12 0 0 1-24 0h1.5A10.5 10.5 0 0 0 12 22.5Z",
        fill: "url(#loading-dark_svg__a)"
      })), _path2$5 || (_path2$5 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22.5 12a10.5 10.5 0 1 0-21 0H0a12 12 0 1 1 24 0h-1.5Z",
        fill: "url(#loading-dark_svg__b)"
      })), _path3 || (_path3 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M23.242 12.984a.75.75 0 0 1-.743-.757v-.22a.75.75 0 0 1 1.5-.015v.25a.75.75 0 0 1-.757.742Z",
        fill: "#fff"
      })), _defs$1 || (_defs$1 = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("linearGradient", {
        id: "loading-dark_svg__a",
        x1: 23.249,
        y1: 23.25,
        x2: 0.75,
        y2: 23.25,
        gradientUnits: "userSpaceOnUse"
      }, /*#__PURE__*/React__namespace.createElement("stop", {
        stopColor: "#fff",
        stopOpacity: 0
      }), /*#__PURE__*/React__namespace.createElement("stop", {
        offset: 1,
        stopColor: "#fff",
        stopOpacity: 0.5
      })), /*#__PURE__*/React__namespace.createElement("linearGradient", {
        id: "loading-dark_svg__b",
        x1: 23.249,
        y1: 12,
        x2: 0.75,
        y2: 12,
        gradientUnits: "userSpaceOnUse"
      }, /*#__PURE__*/React__namespace.createElement("stop", {
        stopColor: "#fff"
      }), /*#__PURE__*/React__namespace.createElement("stop", {
        offset: 1,
        stopColor: "#fff",
        stopOpacity: 0.5
      })))));
    };

    var _path$g;
    function _extends$h() { _extends$h = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }
    var SvgMinus = function SvgMinus(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$h({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$g || (_path$g = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M2.9 12A1.1 1.1 0 0 1 4 10.9h16a1.1 1.1 0 0 1 0 2.2H4A1.1 1.1 0 0 1 2.9 12Z"
      })));
    };

    var _path$f, _path2$4;
    function _extends$g() { _extends$g = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }
    var SvgOut = function SvgOut(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$g({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$f || (_path$f = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M14.1 17a1.1 1.1 0 0 0-2.2 0v1a.9.9 0 0 1-.9.9H6a.9.9 0 0 1-.9-.9V6a.9.9 0 0 1 .9-.9h5a.9.9 0 0 1 .9.9v1a1.1 1.1 0 0 0 2.2 0V6A3.1 3.1 0 0 0 11 2.9H6A3.1 3.1 0 0 0 2.9 6v12A3.1 3.1 0 0 0 6 21.1h5a3.1 3.1 0 0 0 3.1-3.1v-1Z"
      })), _path2$4 || (_path2$4 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M18.085 7.784a1.1 1.1 0 0 0-1.67 1.432l1.443 1.684H10.75a1.1 1.1 0 0 0 0 2.2h7.108l-1.443 1.684a1.1 1.1 0 0 0 1.67 1.432l3-3.5a1.1 1.1 0 0 0 0-1.432l-3-3.5Z"
      })));
    };

    var _path$e;
    function _extends$f() { _extends$f = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }
    var SvgPlus = function SvgPlus(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$f({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$e || (_path$e = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 2.9A1.1 1.1 0 0 1 13.1 4v6.9H20a1.1 1.1 0 0 1 0 2.2h-6.9V20a1.1 1.1 0 0 1-2.2 0v-6.9H4a1.1 1.1 0 0 1 0-2.2h6.9V4A1.1 1.1 0 0 1 12 2.9Z"
      })));
    };

    var _path$d;
    function _extends$e() { _extends$e = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }
    var SvgRefreshA = function SvgRefreshA(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$e({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$d || (_path$d = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12 5.1a6.873 6.873 0 0 0-4.744 1.89 1.1 1.1 0 0 1-1.512-1.598 9.1 9.1 0 0 1 15.322 5.817l.873-.952a1.1 1.1 0 0 1 1.622 1.486l-2.75 3a1.1 1.1 0 0 1-1.622 0l-2.75-3a1.1 1.1 0 0 1 1.622-1.486l.782.853A6.901 6.901 0 0 0 12 5.1ZM12 18.9a6.877 6.877 0 0 0 5.01-2.156 1.1 1.1 0 0 1 1.598 1.512 9.1 9.1 0 0 1-15.674-5.465l-.873.952a1.1 1.1 0 1 1-1.622-1.486l2.75-3a1.1 1.1 0 0 1 1.622 0l2.75 3a1.1 1.1 0 0 1-1.622 1.486l-.782-.853A6.901 6.901 0 0 0 12 18.9Z"
      })));
    };

    var _path$c;
    function _extends$d() { _extends$d = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }
    var SvgRefreshB = function SvgRefreshB(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$d({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$c || (_path$c = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M15.742 5.81a1.1 1.1 0 0 0 0-1.62l-3-2.75a1.1 1.1 0 1 0-1.486 1.62l1.03.944A9 9 0 1 0 21 13a1 1 0 1 0-2.001 0 7 7 0 1 1-6.725-6.995l-1.018.934a1.1 1.1 0 1 0 1.486 1.622l3-2.75Z"
      })));
    };

    var _path$b;
    function _extends$c() { _extends$c = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }
    var SvgSearch = function SvgSearch(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$c({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$b || (_path$b = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 10.516C2 5.813 5.844 2 10.585 2c4.741 0 8.585 3.813 8.585 8.516 0 2.022-.71 3.879-1.897 5.34l4.423 4.387a1.024 1.024 0 0 1 0 1.456 1.044 1.044 0 0 1-1.468 0l-4.442-4.407a8.592 8.592 0 0 1-5.201 1.74C5.844 19.032 2 15.219 2 10.516Zm8.585-6.457c-3.595 0-6.51 2.89-6.51 6.457 0 3.566 2.915 6.457 6.51 6.457 3.595 0 6.51-2.891 6.51-6.457s-2.915-6.457-6.51-6.457Z"
      })));
    };

    var _path$a;
    function _extends$b() { _extends$b = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
    var SvgShare = function SvgShare(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$b({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$a || (_path$a = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M1.9 12.5a3.6 3.6 0 0 1 6.007-2.677l6.077-3.546a3.6 3.6 0 1 1 1.11 1.9l-6.078 3.546a3.614 3.614 0 0 1 .042 1.326l5.868 2.934a3.6 3.6 0 1 1-.984 1.968l-5.868-2.934A3.6 3.6 0 0 1 1.9 12.5Zm14.2-7a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm-12 7a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0Zm13.4 4.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
      })));
    };

    var _path$9, _path2$3;
    function _extends$a() { _extends$a = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
    var SvgSquareCheck = function SvgSquareCheck(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$a({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$9 || (_path$9 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M18.878 7.922a1.1 1.1 0 0 1 0 1.556l-7.5 7.5a1.1 1.1 0 0 1-1.556 0l-4.5-4.5a1.1 1.1 0 1 1 1.556-1.556l3.722 3.722 6.722-6.722a1.1 1.1 0 0 1 1.556 0Z",
        fill: "#fff"
      })), _path2$3 || (_path2$3 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm13.322 5.922a1.1 1.1 0 0 1 1.556 1.556l-7.5 7.5a1.1 1.1 0 0 1-1.556 0l-4.5-4.5a1.1 1.1 0 1 1 1.556-1.556l3.722 3.722 6.722-6.722Z"
      })));
    };

    var _path$8;
    function _extends$9() { _extends$9 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
    var SvgSquareEmpty = function SvgSquareEmpty(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$9({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$8 || (_path$8 = /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm3-1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5Z"
      })));
    };

    var _g, _defs;
    function _extends$8() { _extends$8 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
    var SvgTarget = function SvgTarget(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$8({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
        clipPath: "url(#target_svg__a)"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        d: "M13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      }), /*#__PURE__*/React__namespace.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 .9C5.87.9.9 5.87.9 12S5.87 23.1 12 23.1 23.1 18.13 23.1 12 18.13.9 12 .9ZM20.844 13A8.904 8.904 0 0 1 13 20.845V18a1 1 0 1 0-2 0v2.845A8.904 8.904 0 0 1 3.155 13H6a1 1 0 1 0 0-2H3.155A8.904 8.904 0 0 1 11 3.156V6a1 1 0 1 0 2 0V3.156A8.904 8.904 0 0 1 20.844 11H18a1 1 0 1 0 0 2h2.844Z"
      }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
        id: "target_svg__a"
      }, /*#__PURE__*/React__namespace.createElement("path", {
        fill: "#fff",
        d: "M0 0h24v24H0z"
      })))));
    };

    var _path$7;
    function _extends$7() { _extends$7 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
    var SvgTriangleDown = function SvgTriangleDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$7({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$7 || (_path$7 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6.374 10.397c-.68-.794-.116-2.022.93-2.022h9.391c1.047 0 1.612 1.228.93 2.022l-4.695 5.478c-.489.57-1.371.57-1.86 0l-4.696-5.478Z"
      })));
    };

    var _path$6;
    function _extends$6() { _extends$6 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
    var SvgTriangleUp = function SvgTriangleUp(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$6({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$6 || (_path$6 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.695 16.625c1.047 0 1.612-1.228.93-2.022L12.93 9.125a1.225 1.225 0 0 0-1.86 0l-4.696 5.478c-.68.794-.116 2.022.93 2.022h9.391Z"
      })));
    };

    var _path$5, _path2$2;
    function _extends$5() { _extends$5 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
    var SvgTrianglesDown = function SvgTrianglesDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$5({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$5 || (_path$5 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.726 15.03c-.518-.6-.089-1.53.707-1.53h7.135c.795 0 1.224.93.706 1.53l-3.567 4.146a.933.933 0 0 1-1.414 0L7.726 15.03Z"
      })), _path2$2 || (_path2$2 = /*#__PURE__*/React__namespace.createElement("path", {
        opacity: 0.25,
        d: "M16.274 8.97c.518.6.089 1.53-.707 1.53H8.434c-.796 0-1.225-.93-.707-1.53l3.567-4.146a.933.933 0 0 1 1.414 0l3.567 4.146Z"
      })));
    };

    var _path$4;
    function _extends$4() { _extends$4 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
    var SvgTrianglesUpDown = function SvgTrianglesUpDown(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$4({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$4 || (_path$4 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M7.726 15.03c-.518-.6-.089-1.53.707-1.53h7.135c.795 0 1.224.93.706 1.53l-3.567 4.146a.933.933 0 0 1-1.414 0L7.726 15.03ZM16.274 8.97c.518.6.089 1.53-.707 1.53H8.434c-.796 0-1.225-.93-.707-1.53l3.567-4.146a.933.933 0 0 1 1.414 0l3.567 4.146Z"
      })));
    };

    var _path$3, _path2$1;
    function _extends$3() { _extends$3 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
    var SvgTrianglesUp = function SvgTrianglesUp(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$3({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$3 || (_path$3 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M16.274 8.97c.518.6.089 1.53-.707 1.53H8.434c-.796 0-1.225-.93-.707-1.53l3.567-4.146a.933.933 0 0 1 1.414 0l3.567 4.146Z"
      })), _path2$1 || (_path2$1 = /*#__PURE__*/React__namespace.createElement("path", {
        opacity: 0.25,
        d: "M7.726 15.03c-.518-.6-.089-1.53.707-1.53h7.135c.795 0 1.224.93.706 1.53l-3.567 4.146a.933.933 0 0 1-1.414 0L7.726 15.03Z"
      })));
    };

    var _path$2, _path2;
    function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
    var SvgUpload = function SvgUpload(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$2({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$2 || (_path$2 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.716 3.165a1.1 1.1 0 0 0-1.432 0l-3.5 3a1.1 1.1 0 1 0 1.432 1.67L10.9 6.392V14a1.1 1.1 0 0 0 2.2 0V6.392l1.684 1.443a1.1 1.1 0 0 0 1.432-1.67l-3.5-3Z"
      })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M4 10.4a1.1 1.1 0 0 1 1.1 1.1V18a.9.9 0 0 0 .9.9h12a.9.9 0 0 0 .9-.9v-6.5a1.1 1.1 0 0 1 2.2 0V18a3.1 3.1 0 0 1-3.1 3.1H6A3.1 3.1 0 0 1 2.9 18v-6.5A1.1 1.1 0 0 1 4 10.4Z"
      })));
    };

    var _path$1;
    function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
    var SvgWarm = function SvgWarm(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends$1({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path$1 || (_path$1 = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M12.725 4.077a1.1 1.1 0 1 0-1.45-1.654c-.706.619-1.416 1.952-1.665 3.603-.258 1.71-.041 3.854 1.234 6.14l.015.028.017.026c1.836 2.893 1.145 5.79-.29 7.943a1.1 1.1 0 1 0 1.83 1.22c1.747-2.62 2.757-6.472.335-10.314-1.016-1.834-1.153-3.473-.965-4.715.197-1.308.737-2.1.94-2.277ZM6.006 8.521a1.1 1.1 0 1 0-1.968-.983c-.56 1.121-.513 2.412-.247 3.587.27 1.192.799 2.414 1.388 3.517 1.102 2.061.417 4.002-.935 5.354A1.1 1.1 0 0 0 5.8 21.55c1.835-1.834 3-4.802 1.32-7.946-.54-1.009-.973-2.037-1.183-2.966-.214-.946-.166-1.647.07-2.118ZM18.607 8.521a1.1 1.1 0 0 0-1.968-.983c-.56 1.121-.513 2.412-.247 3.587.27 1.192.799 2.414 1.388 3.517 1.102 2.061.416 4.002-.935 5.354a1.1 1.1 0 0 0 1.556 1.555c1.834-1.834 3-4.802 1.32-7.946-.54-1.009-.973-2.037-1.183-2.966-.215-.946-.167-1.647.069-2.118Z"
      })));
    };

    var _path;
    function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
    var SvgZip = function SvgZip(props) {
      return /*#__PURE__*/React__namespace.createElement("svg", _extends({
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg"
      }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
        d: "M6 4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2H6ZM5 8a1 1 0 0 0 0 2h6v9a1 1 0 1 0 2 0v-9h6a1 1 0 1 0 0-2H5Z"
      })));
    };

    var svg = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Adjust: SvgAdjust,
        ArrowDown: SvgArrowDown,
        ArrowIn: SvgArrowIn,
        ArrowLeft: SvgArrowLeft,
        ArrowOut: SvgArrowOut,
        ArrowRight: SvgArrowRight,
        ArrowUp: SvgArrowUp,
        BagFill: SvgBagFill,
        BagStroke: SvgBagStroke,
        Bars: SvgBars,
        BellFill: SvgBellFill,
        BellStroke: SvgBellStroke,
        BikeFill: SvgBikeFill,
        BikeStroke: SvgBikeStroke,
        Block: SvgBlock,
        BookmarkFill: SvgBookmarkFill,
        BookmarkStore: SvgBookmarkStore,
        BubbleDotsFill: SvgBubbleDotsFill,
        BubbleDotsStroke: SvgBubbleDotsStroke,
        BubbleFill: SvgBubbleFill,
        BubbleStroke: SvgBubbleStroke,
        BycicleFill: SvgBycicleFill,
        BycicleStroke: SvgBycicleStroke,
        CalendarAFill: SvgCalendarAFill,
        CalendarAStroke: SvgCalendarAStroke,
        CalendarBFill: SvgCalendarBFill,
        CalendarBStroke: SvgCalendarBStroke,
        CallCircleFill: SvgCallCircleFill,
        CallCircleStroke: SvgCallCircleStroke,
        CallFill: SvgCallFill,
        CallStroke: SvgCallStroke,
        CameraFill: SvgCameraFill,
        CameraStroke: SvgCameraStroke,
        CarFill: SvgCarFill,
        CarStorke: SvgCarStorke,
        ChannelFill: SvgChannelFill,
        ChartStorke: SvgChartStroke,
        Check: SvgCheck,
        ChevronDown: SvgChevronDown,
        ChevronLeft: SvgChevronLeft,
        ChevronRight: SvgChevronRight,
        ChevronUp: SvgChevronUp,
        CircleCheck: SvgCircleCheck,
        CircleEmpty: SvgCircleEmpty,
        Clips: SvgClips,
        Close: SvgClose,
        CloseCircleFill: SvgCloseCircleFill,
        CloseCircleStroke: SvgCloseCircleStroke,
        CollectionFill: SvgCollectionFill,
        Compress: SvgCompress,
        CopyFill: SvgCopyFill,
        CopyStroke: SvgCopyStroke,
        CreditcardFill: SvgCreditcardFill,
        CreditcardStroke: SvgCreditcardStroke,
        DeleteFill: SvgDeleteFill,
        DeleteStroke: SvgDeleteStroke,
        DeliveryFill: SvgDeliveryFill,
        DeliveryStroke: SvgDeliveryStroke,
        DocumentFill: SvgDocumentFill,
        DocumentInfoFill: SvgDocumentInfoFill,
        DocumentStroke: SvgDocumentStroke,
        DocumentTermsFill: SvgDocumentTermsFill,
        Dots: SvgDots,
        DownCircleFill: SvgDownCircleFill,
        DownCircleStroke: SvgDownCircleStroke,
        Download: SvgDownload,
        EditFill: SvgEditFill,
        EditStroke: SvgEditStroke,
        Exchange: SvgExchange,
        ExchangeCircleFill: SvgExchangeCircleFill,
        ExchangeCircleStroke: SvgExchangeCircleStroke,
        Expand: SvgExpand,
        EyeFill: SvgEyeFill,
        EyeSlashFill: SvgEyeSlashFill,
        EyeSlashStroke: SvgEyeSlashStroke,
        EyeStroke: SvgEyeStroke,
        FilterCircleFill: SvgFilterCircleFill,
        FilterCircleStroke: SvgFilterCircleStroke,
        FragileFill: SvgFragileFill,
        FragileStroke: SvgFragileStroke,
        Frozen: SvgFrozen,
        GlobeStroke: SvgGlobeStroke,
        Handle: SvgHandle,
        HeartFill: SvgHeartFill,
        HeartStroke: SvgHeartStroke,
        HomeFill: SvgHomeFill,
        HomeStroke: SvgHomeStroke,
        InfoCircleFill: SvgInfoCircleFill,
        InfoCircleStroke: SvgInfoCircleStroke,
        LeftCircleFill: SvgLeftCircleFill,
        LeftCircleStroke: SvgLeftCircleStroke,
        LimitDown: SvgLimitDown,
        LimitLeft: SvgLimitLeft,
        LimitRight: SvgLimitRight,
        LimitUp: SvgLimitUp,
        Line: SvgLine,
        LinePointFill: SvgLinePointFill,
        LinePointStroke: SvgLinePointStroke,
        List: SvgList,
        LoadingDark: SvgLoadingDark,
        LoadingLight: SvgLoadingLight,
        LockFill: SvgLockFill,
        LockStroke: SvgLockStroke,
        MailFill: SvgMailFill,
        MailStroke: SvgMailStroke,
        MarkerFill: SvgMarkerFill,
        MarkerStroke: SvgMarkerStroke,
        Minus: SvgMinus,
        MinusCircleFill: SvgMinusCircleFill,
        MinusCircleStroke: SvgMinusCircleStroke,
        MoonStroke: SvgMoonStroke,
        NarrowFill: SvgNarrowFill,
        NarrowStroke: SvgNarrowStroke,
        NewCircleFill: SvgNewCircleFill,
        NewCircleStroke: SvgNewCircleStroke,
        OfficeFill: SvgOfficeFill,
        Out: SvgOut,
        Plus: SvgPlus,
        PlusCircleFill: SvgPlusCircleFill,
        PlusCircleStroke: SvgPlusCircleStroke,
        PrinterFill: SvgPrinterFill,
        PrinterStroke: SvgPrinterStroke,
        ProfileCircleFill: SvgProfileCircleFill,
        ProfileCircleStroke: SvgProfileCircleStroke,
        ProfileFill: SvgProfileFill,
        ProfileSettingFill: SvgProfileSettingFill,
        ProfileStroke: SvgProfileStroke,
        QuestionCircleFill: SvgQuestionCircleFill,
        QuestionCircleStroke: SvgQuestionCircleStroke,
        RefreshA: SvgRefreshA,
        RefreshB: SvgRefreshB,
        ReportFill: SvgReportFill,
        ReportStroke: SvgReportStroke,
        RightCircleFill: SvgRightCircleFill,
        RightCircleStroke: SvgRightCircleStroke,
        Search: SvgSearch,
        SettingFill: SvgSettingFill,
        SettingStroke: SvgSettingStroke,
        Share: SvgShare,
        ShieldPrivacyFill: SvgShieldPrivacyFill,
        ShieldWSimFill: SvgShieldWSimFill,
        SquareCheck: SvgSquareCheck,
        SquareEmpty: SvgSquareEmpty,
        StarFill: SvgStarFill,
        StarStroke: SvgStarStroke,
        StoreFill: SvgStoreFill,
        StoreStroke: SvgStoreStroke,
        SunStroke: SvgSunStroke,
        Target: SvgTarget,
        ThumbupFill: SvgThumbupFill,
        ThumbupStroke: SvgThumbupStroke,
        TicketFill: SvgTicketFill,
        TicketStroke: SvgTicketStroke,
        TimeFill: SvgTimeFill,
        TimeStroke: SvgTimeStroke,
        Title: SvgTitle,
        TrashFill: SvgTrashFill,
        TrashStroke: SvgTrashStroke,
        TriangleDown: SvgTriangleDown,
        TriangleUp: SvgTriangleUp,
        TriangleUpDown: SvgTriangleUpDown,
        TrianglesDown: SvgTrianglesDown,
        TrianglesUp: SvgTrianglesUp,
        TrianglesUpDown: SvgTrianglesUpDown,
        UpCircleFill: SvgUpCircleFill,
        UpCircleStroke: SvgUpCircleStroke,
        Upload: SvgUpload,
        ViewColumnsStroke: SvgViewColumnsStroke,
        ViewRowsFill: SvgViewRowsFill,
        Warm: SvgWarm,
        WarningCircleFill: SvgWarningCircleFill,
        WarningCircleStroke: SvgWarningCircleStroke,
        WarningTriangleFill: SvgWarningTriangleFill,
        WarningTriangleStroke: SvgWarningTriangleStroke,
        WideFill: SvgWideFill,
        WideStroke: SvgWideStroke,
        Zip: SvgZip
    });

    const IconNames = Object.keys(svg);
    const Icon = _a => {
      var {
          name,
          size = 24,
          className
        } = _a,
        props = __rest(_a, ["name", "size", "className"]);
      return React__namespace.createElement(svg[name], Object.assign({
        width: size,
        height: size,
        className: `inline-block ${className}`
      }, props));
    };

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
        rest = __rest(props, ["hint", "label", "isValid", "isSubmitted", "isSubmitting", "leftChildren", "rightChildren", "className", "size"]);
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
        rest = __rest(props, ["isSubmitted", "isSubmitting", "isValid", "leftIconName", "className", "onChange", "rightChildren"]);
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
      return jsxRuntime.jsx(Input, Object.assign({
        leftChildren: leftIconName && jsxRuntime.jsx(Icon, {
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
            children: jsxRuntime.jsx(Icon, {
              size: props.size === 'sm' ? 16 : 20,
              className: "text-secondary",
              name: "CloseCircleFill"
            })
          })) : iconType === 'success' ? jsxRuntime.jsx(Icon, {
            size: props.size === 'sm' ? 16 : 20,
            name: "CircleCheck",
            className: "text-blue-primary"
          }) : iconType === 'fail' ? jsxRuntime.jsx(Icon, {
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
        children: [jsxRuntime.jsx(Icon, {
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
        })), jsxRuntime.jsx(Icon, {
          className: "cursor-pointer",
          name: "Close",
          size: 24,
          onClick: () => reactHotToast.toast.remove(t.id)
        })]
      }));
    };

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
        children: [jsxRuntime.jsx(Icon, {
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
        })), closeable && jsxRuntime.jsx(Icon, {
          className: "cursor-pointer",
          name: "Close",
          size: 24,
          onClick: () => reactHotToast.toast.remove(t.id)
        })]
      }));
    };

    const toast = {
      positive: input => reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastBox, Object.assign({
        type: "positive"
      }, input, {
        t: t
      }))),
      negative: input => reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastBox, Object.assign({
        type: "negative"
      }, input, {
        t: t
      }))),
      promise: (fn, input, theme = 'light', option) => __awaiter(void 0, void 0, void 0, function* () {
        const {
          title,
          description
        } = input;
        const id = reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox, Object.assign({}, option, {
          t: t,
          status: "loading",
          title: title.loading,
          description: description === null || description === void 0 ? void 0 : description.loading,
          theme: theme
        })), {
          duration: Infinity
        });
        fn.then(() => {
          reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox, Object.assign({}, option, {
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
          reactHotToast.toast.custom(t => jsxRuntime.jsx(ToastPromiseBox, Object.assign({}, option, {
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

    const bgColorPrimary = {
      black: 'bg-fill-primary',
      red: 'bg-red-primary',
      orange: 'bg-orange-primary',
      yellow: 'bg-yellow-primary',
      green: 'bg-green-primary',
      blue: 'bg-blue-primary',
      navy: 'bg-navy-primary',
      purple: 'bg-purple-primary'
    };
    const bgColor = {
      black: 'bg-fill-quaternary',
      red: 'bg-red-quaternary',
      orange: 'bg-orange-quaternary',
      yellow: 'bg-yellow-quaternary',
      green: 'bg-green-quaternary',
      blue: 'bg-blue-quaternary',
      navy: 'bg-navy-quaternary',
      purple: 'bg-purple-quaternary'
    };
    const textColor = {
      black: 'text-primary',
      red: 'text-red-primary',
      orange: 'text-orange-primary',
      yellow: 'text-yellow-primary',
      green: 'text-green-primary',
      blue: 'text-blue-primary',
      navy: 'text-navy-primary',
      purple: 'text-purple-primary'
    };
    const disabledTextColor = {
      black: 'text-tertiary',
      red: 'text-red-tertiary',
      orange: 'text-orange-tertiary',
      yellow: 'text-yellow-tertiary',
      green: 'text-green-tertiary',
      blue: 'text-blue-tertiary',
      navy: 'text-navy-tertiary',
      purple: 'text-purple-tertiary'
    };
    const Badge = props => {
      const {
        children,
        left,
        right,
        color = 'black',
        type = 'primary',
        size = 'md'
      } = props;
      const {
        textColorCN,
        rightIconColorCN
      } = React.useMemo(() => {
        switch (type) {
          case 'primary':
            return {
              textColorCN: 'text-above-primary',
              rightIconColorCN: !(right === null || right === void 0 ? void 0 : right.disabled) ? 'text-above-primary' : 'text-above-tertiary'
            };
          case 'secondary':
            return {
              textColorCN: textColor[color],
              rightIconColorCN: !(right === null || right === void 0 ? void 0 : right.disabled) ? textColor[color] : disabledTextColor[color]
            };
          case 'tertiary':
            return {
              textColorCN: 'text-primary',
              rightIconColorCN: !(right === null || right === void 0 ? void 0 : right.disabled) ? 'text-primary' : 'text-tertiary'
            };
          default:
            return {
              textColorCN: '',
              rightIconColorCN: ''
            };
        }
      }, [type, color, right]);
      const bgCN = React.useMemo(() => {
        switch (type) {
          case 'primary':
            return bgColorPrimary[color];
          case 'secondary':
          case 'tertiary':
            return bgColor[color];
          default:
            return '';
        }
      }, [type, color]);
      const {
        fontSize,
        iconSize,
        padding
      } = React.useMemo(() => {
        switch (size) {
          case 'md':
            return {
              fontSize: 'font-12-bold',
              iconSize: 12,
              padding: 'py-1 px-3'
            };
          case 'sm':
            return {
              fontSize: 'font-10-bold',
              iconSize: 10,
              padding: 'py-0.5 px-1.5'
            };
          default:
            return {
              fontSize: 'font-12-bold',
              iconSize: 12,
              padding: 'py-1 px-3'
            };
        }
      }, [size]);
      return jsxRuntime.jsxs("div", Object.assign({
        className: ['inline-flex items-center rounded-full gap-1', bgCN, fontSize, padding].join(' ')
      }, {
        children: [left && jsxRuntime.jsx(Icon, {
          name: left.iconName,
          size: iconSize,
          onClick: left.onClick,
          className: left.onClick ? 'cursor-pointer' : ''
        }), jsxRuntime.jsx("span", Object.assign({
          className: ['whitespace-nowrap', textColorCN].join(' ')
        }, {
          children: children
        })), right && jsxRuntime.jsx(Icon, {
          name: right.iconName,
          size: iconSize,
          onClick: !right.disabled ? right.onClick : undefined,
          className: [rightIconColorCN, !right.disabled && right.onClick ? 'cursor-pointer' : '', right.disabled ? 'cursor-not-allowed' : ''].join(' ')
        })]
      }));
    };

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
                  children: jsxRuntime.jsx(Icon, Object.assign({}, icon))
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
        restOptions = __rest(_a, ["children", "modal"]);
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
        props = __rest(_a, ["children", "asChild"]);
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
        props = __rest(_a, ["style", "isPortal", "disabledFloatingStyle"]);
      const _b = usePopoverContext(),
        {
          context: floatingContext
        } = _b,
        context = __rest(_b, ["context"]);
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
          children: jsxRuntime.jsx(Icon, {
            name: "Close"
          })
        }))]
      }));
    });

    exports.Badge = Badge;
    exports.Dialog = Dialog;
    exports.Icon = Icon;
    exports.IconNames = IconNames;
    exports.Input = Input;
    exports.Popover = Popover;
    exports.PopoverContent = PopoverContent;
    exports.PopoverHeading = PopoverHeading;
    exports.PopoverTrigger = PopoverTrigger;
    exports.TextInput = TextInput;
    exports.Toaster = Toaster;
    exports.Tooltip = Tooltip;
    exports.toast = toast;
    exports.usePopover = usePopover;
    exports.usePopoverContext = usePopoverContext;

}));
