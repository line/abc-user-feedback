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
class PathV3 {
  private static instance: PathV3;
  public static get Instance(): PathV3 {
    return this.instance || (this.instance = new this());
  }

  get CREATE_TENANT() {
    return '/tenant/create';
  }
  get SIGN_IN() {
    return '/auth/sign-in';
  }

  get SIGN_UP() {
    return '/auth/sign-up';
  }

  get PASSWORD_RESET() {
    return '/auth/reset-password';
  }

  get MAIN() {
    return '/main';
  }

  get CREATE_PROJECT() {
    return '/main/project/create';
  }
  get CREATE_PROJECT_COMPLETE() {
    return '/main/project/create-complete';
  }
  get CREATE_CHANNEL() {
    return '/main/project/[projectId]/channel/create';
  }
  get CREATE_CHANNEL_COMPLETE() {
    return '/main/project/[projectId]/channel/create-complete';
  }

  get PROJECT_MAIN() {
    return this.DASHBOARD;
  }
  get DASHBOARD() {
    return '/main/project/[projectId]/dashboard';
  }

  get FEEDBACK() {
    return '/main/project/[projectId]/feedback';
  }

  get ISSUE() {
    return '/main/project/[projectId]/issue';
  }

  get SETTINGS() {
    return '/main/project/[projectId]/setting';
  }

  isErrorPage(pathname: string) {
    return pathname.startsWith('/error');
  }

  isProtectPage(pathname: string) {
    return pathname.startsWith('/main');
  }

  hasSideNav(pathname: string) {
    return pathname.startsWith('/main/project/[projectId]');
  }
}

export const Path = PathV3.Instance;
