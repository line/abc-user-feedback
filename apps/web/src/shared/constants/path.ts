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
  private static instance: PathV3 | null;
  public static get Instance(): PathV3 {
    return this.instance ?? (this.instance = new this());
  }

  readonly CREATE_TENANT = '/tenant/create';
  readonly SIGN_IN = '/auth/sign-in';
  readonly SIGN_UP = '/auth/sign-up';
  readonly PASSWORD_RESET = '/auth/reset-password';
  readonly MAIN = '/main';
  readonly CREATE_PROJECT = '/main/project/create';
  readonly CREATE_PROJECT_COMPLETE = '/main/project/create-complete';
  readonly CREATE_CHANNEL = '/main/project/[projectId]/channel/create';
  readonly CREATE_CHANNEL_COMPLETE =
    '/main/project/[projectId]/channel/create-complete';

  get PROJECT_MAIN() {
    return this.DASHBOARD;
  }
  readonly DASHBOARD = '/main/project/[projectId]/dashboard';
  readonly FEEDBACK = '/main/project/[projectId]/feedback';
  readonly ISSUE = '/main/project/[projectId]/issue';
  readonly SETTINGS = '/main/project/[projectId]/settings';

  isErrorPage(pathname: string) {
    return pathname === '/404' || pathname === '/403';
  }

  isProtectPage(pathname: string) {
    return pathname.startsWith('/main');
  }

  hasSideNav(pathname: string) {
    return pathname.startsWith('/main/project/[projectId]');
  }
}

export const Path = PathV3.Instance;
