'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var Icon = require('../Icon/Icon.js');

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
    children: [left && jsxRuntime.jsx(Icon.Icon, {
      name: left.iconName,
      size: iconSize,
      onClick: left.onClick,
      className: left.onClick ? 'cursor-pointer' : ''
    }), jsxRuntime.jsx("span", Object.assign({
      className: ['whitespace-nowrap', textColorCN].join(' ')
    }, {
      children: children
    })), right && jsxRuntime.jsx(Icon.Icon, {
      name: right.iconName,
      size: iconSize,
      onClick: !right.disabled ? right.onClick : undefined,
      className: [rightIconColorCN, !right.disabled && right.onClick ? 'cursor-pointer' : '', right.disabled ? 'cursor-not-allowed' : ''].join(' ')
    })]
  }));
};

exports.Badge = Badge;
