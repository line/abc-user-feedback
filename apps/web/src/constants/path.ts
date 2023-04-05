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
export const PATH = {
  DASHBOARD: '/dashboard',
  AUTH: {
    SIGN_IN: '/auth/signIn',
    SIGN_UP: '/auth/signUp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  LINK: {
    RESET_PASSWORD: '/link/reset-password',
    USER_INVITATION: '/link/user-invitation',
  },
  PROJECT_MANAGEMENT: {
    LIST: '/project-management',
    PROJECT: {
      CREATE: '/project-management/project/create',
      DETAIL: '/project-management/project/[projectId]',
      MODIFY: '/project-management/project/[projectId]/modify',
    },
    CHANNEL: {
      CREATE: '/project-management/project/[projectId]/channel/create',
      DETAIL: '/project-management/project/[projectId]/channel/[channelId]',
      MODIFY:
        '/project-management/project/[projectId]/channel/[channelId]/modify',
      STATISTICS: '/project-management/channel/[channelId]/statistics',
    },
  },
  SETTING: {
    ROLE: {
      CREATE: '/setting/role/create',
      LIST: '/setting/role',
      DETAIL: '/setting/role/[roleId]',
    },
    USER: '/setting/user',
    TENANT: '/setting/tenant',
    ACCOUNT: {
      PROFILE: '/setting/account/profile',
      PASSWORD: '/setting/account/password',
    },
  },
  TENANT_INITIAL_SETTING: '/tenant/create',
};

export const INIT_PATH = PATH.PROJECT_MANAGEMENT.LIST;
