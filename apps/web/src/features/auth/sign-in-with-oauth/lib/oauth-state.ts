/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
const OAUTH_STATE_KEY = 'oauth_state';

/**
 * Keeps the state of the login this browser started, so the callback page
 * only accepts a code from that login.
 */
export const saveOAuthState = (loginUrl: string) => {
  try {
    const state = new URL(loginUrl).searchParams.get('state');
    if (state) sessionStorage.setItem(OAUTH_STATE_KEY, state);
  } catch {
    // An invalid URL or blocked storage makes the callback reject the login.
  }
};

export const matchesOAuthState = (state: string) => {
  try {
    return sessionStorage.getItem(OAUTH_STATE_KEY) === state;
  } catch {
    return false;
  }
};

/** Makes the saved state single-use once its callback has been handled. */
export const clearOAuthState = () => {
  try {
    sessionStorage.removeItem(OAUTH_STATE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
};
