/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
const colors = require('./colors');

module.exports = {
  fill: {
    primary: 'var(--fill-color-primary)',
    secondary: 'var(--fill-color-secondary)',
    tertiary: 'var(--fill-color-tertiary)',
    quaternary: 'var(--fill-color-quaternary)',
    inverse: 'var(--fill-color-inverse)',
    ...colors,
  },
  colors: {
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    text: {
      primary: 'var(--text-color-primary)',
      secondary: 'var(--text-color-secondary)',
      tertiary: 'var(--text-color-tertiary)',
      quaternary: 'var(--text-color-quaternary)',
      inverse: 'var(--text-color-inverse)',
    },
    ...colors,
  },
  textColor: {
    primary: 'var(--text-color-primary)',
    secondary: 'var(--text-color-secondary)',
    tertiary: 'var(--text-color-tertiary)',
    quaternary: 'var(--text-color-quaternary)',
    inverse: 'var(--text-color-inverse)',
    above: {
      primary: 'var(--text-above-color-primary)',
      secondary: 'var(--text-above-color-secondary)',
      tertiary: 'var(--text-above-color-tertiary)',
      quaternary: 'var(--text-above-color-quaternary)',
      ...colors,
    },
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    ...colors,
  },
  backgroundColor: {
    primary: 'var(--background-color-primary)',
    secondary: 'var(--background-color-secondary)',
    tertiary: 'var(--background-color-tertiary)',
    dim: 'var(--background-color-dim)',
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    ...colors,
  },
  borderRadius: {
    DEFAULT: '8px',
    full: '99999px',
    none: '0',
  },
  boxShadow: {
    drop: '0px 4px 16px 0px rgb(var(--shadow-rgb) / 20%)',
    top: '0 -0.031rem 0 rgb(var(--shadow-rgb) / 10%)',
    bottom: '0 0.031rem 0 rgb(var(--shadow-rgb) / 10%)',
    'floating-depth-1': '0 0 0.063rem rgb(var(--shadow-rgb) / 30%)',
    'floating-depth-2': '0 0.25rem 0.5rem rgb(var(--shadow-rgb) / 30%)',
    'floating-depth-3': '0 0.25rem 1rem rgb(var(--shadow-rgb) / 20%)',
  },
};
