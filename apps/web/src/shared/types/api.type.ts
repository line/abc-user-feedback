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

export interface paths {
  '/api/admin/auth/email/code': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_sendCode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/email/code/verify': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_verifyEmailCode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signUp/email': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_signUpEmailUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signUp/invitation': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_signUpInvitationUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signUp/oauth': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_signUpOAuthUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signIn/email': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AuthController_signInEmail'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signIn/oauth/loginURL': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthController_redirectToLoginURL'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/signIn/oauth': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthController_handleCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/auth/refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthController_refreshToken'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['UserController_getAllUsers'];
    put?: never;
    post?: never;
    delete: operations['UserController_deleteUsers'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/search': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['UserController_searchUsers'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['UserController_getUser'];
    put: operations['UserController_updateUser'];
    post?: never;
    delete: operations['UserController_deleteUser'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/{userId}/roles': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['UserController_getRoles'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/invite': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['UserController_inviteUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/password/reset/code': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['UserController_requestResetPassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/password/reset': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['UserController_resetPassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/users/password/change': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['UserController_changePassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/tenants': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TenantController_get'];
    put: operations['TenantController_update'];
    post: operations['TenantController_setup'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/tenants/{tenantId}/feedback-count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TenantController_countFeedbacks'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/roles': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['RoleController_getAllRolesByProjectId'];
    put?: never;
    post: operations['RoleController_createRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/roles/{roleId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['RoleController_updateRole'];
    post?: never;
    delete: operations['RoleController_deleteRole'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MemberController_getAllRolesByProjectId'];
    put?: never;
    post: operations['MemberController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/members/{memberId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['MemberController_update'];
    post?: never;
    delete: operations['MemberController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/api-keys': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ApiKeyController_findAll'];
    put?: never;
    post: operations['ApiKeyController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/soft': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['ApiKeyController_softDelete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/recover': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['ApiKeyController_recover'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/api-keys/{apiKeyId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['ApiKeyController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ChannelController_findAllByProjectId'];
    put?: never;
    post: operations['ChannelController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/name-check': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ChannelController_checkName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ChannelController_findOne'];
    put: operations['ChannelController_updateOne'];
    post?: never;
    delete: operations['ChannelController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/fields': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['ChannelController_updateFields'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/image-upload-url-test': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['ChannelController_getImageUploadUrlTest'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/fields/{fieldId}/options': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['OptionController_getOptions'];
    put?: never;
    post: operations['OptionController_createOption'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ProjectController_findAll'];
    put?: never;
    post: operations['ProjectController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/name-check': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ProjectController_checkName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ProjectController_findOne'];
    put: operations['ProjectController_updateOne'];
    post?: never;
    delete: operations['ProjectController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/feedback-count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ProjectController_countFeedbacks'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/issue-count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['ProjectController_countIssues'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['FeedbackController_create'];
    delete: operations['FeedbackController_deleteMany'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['FeedbackController_findByChannelId'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['FeedbackController_addIssue'];
    delete: operations['FeedbackController_removeIssue'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/export': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['FeedbackController_exportFeedbacks'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['FeedbackController_updateFeedback'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/issues': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['IssueController_create'];
    delete: operations['IssueController_deleteMany'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/issues/{issueId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['IssueController_findById'];
    put: operations['IssueController_update'];
    post?: never;
    delete: operations['IssueController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/issues/search': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['IssueController_findAllByProjectId'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/issue/count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['IssueStatisticsController_getCount'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/issue/count-by-date': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['IssueStatisticsController_getCountByDate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/issue/count-by-status': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['IssueStatisticsController_getCountByStatus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/feedback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['FeedbackStatisticsController_getCountByDateByChannel'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/feedback/count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['FeedbackStatisticsController_getCount'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/feedback/issued-ratio': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['FeedbackStatisticsController_getIssuedRatio'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/statistics/feedback-issue': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['FeedbackIssueStatisticsController_getCountByDateByIssue'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/issue-tracker': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['IssueTrackerController_findOne'];
    put: operations['IssueTrackerController_updateOne'];
    post: operations['IssueTrackerController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/webhooks': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['WebhookController_getByProjectId'];
    put?: never;
    post: operations['WebhookController_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/projects/{projectId}/webhooks/{webhookId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['WebhookController_get'];
    put: operations['WebhookController_update'];
    post?: never;
    delete: operations['WebhookController_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    EmailVerificationMailingRequestDto: {
      email: string;
    };
    SendEmailCodeResponseDto: {
      expiredAt: string;
    };
    EmailVerificationCodeRequestDto: {
      email: string;
      code: string;
    };
    EmailUserSignUpRequestDto: {
      email: string;
      password: string;
    };
    InvitationUserSignUpRequestDto: {
      password: string;
      code: string;
      email: string;
    };
    OAuthUserSignUpRequestDto: {
      email: string;
      projectName: string;
      roleName: string;
    };
    EmailUserSignInRequestDto: {
      email: string;
      password: string;
    };
    SignInResponseDto: {
      accessToken: string;
      refreshToken: string;
    };
    OAuthLoginUrlResponseDto: {
      url: string;
    };
    PaginationMetaDto: {
      /** @example 10 */
      itemCount: number;
      /** @example 100 */
      totalItems: number;
      /** @example 10 */
      itemsPerPage: number;
      /** @example 10 */
      totalPages: number;
      /** @example 1 */
      currentPage: number;
    };
    ProjectDto: {
      id: number;
      name: string;
    };
    RoleDto: {
      name: string;
      project: components['schemas']['ProjectDto'];
    };
    MemberDto: {
      id: number;
      role: components['schemas']['RoleDto'];
    };
    GetAllUserResponse: {
      id: number;
      email: string;
      name: string;
      department: string | null;
      /** @enum {string} */
      type: 'SUPER' | 'GENERAL';
      members: components['schemas']['MemberDto'][];
      /** Format: date-time */
      createdAt: string;
      /** @enum {string} */
      signUpMethod: 'EMAIL' | 'OAUTH';
    };
    GetAllUserResponseDto: {
      meta: components['schemas']['PaginationMetaDto'];
      items: components['schemas']['GetAllUserResponse'][];
    };
    TimeRange: {
      gte: string;
      lt: string;
    };
    UserSearchQuery: {
      email?: string;
      name?: string;
      department?: string;
      /** @enum {string} */
      type?: 'SUPER' | 'GENERAL';
      createdAt?: components['schemas']['TimeRange'];
      projectId?: number;
    };
    UserOrder: {
      /** @enum {string} */
      createdAt: 'ASC' | 'DESC';
    };
    GetAllUsersRequestDto: {
      /**
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * @default 1
       * @example 1
       */
      page?: number;
      query?: components['schemas']['UserSearchQuery'];
      order?: components['schemas']['UserOrder'];
    };
    DeleteUsersRequestDto: {
      ids: number[];
    };
    UserDto: {
      id: number;
      email: string;
      name: string;
      department: string | null;
      /** @enum {string} */
      type: 'SUPER' | 'GENERAL';
      /** @enum {string} */
      signUpMethod: 'EMAIL' | 'OAUTH';
    };
    RoleProjectDto: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      name: string;
      description: string;
    };
    RoleItemDto: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      name: string;
      permissions: (
        | 'feedback_download_read'
        | 'feedback_update'
        | 'feedback_delete'
        | 'feedback_issue_update'
        | 'issue_create'
        | 'issue_update'
        | 'issue_delete'
        | 'project_update'
        | 'project_delete'
        | 'project_member_read'
        | 'project_member_create'
        | 'project_member_update'
        | 'project_member_delete'
        | 'project_role_read'
        | 'project_role_create'
        | 'project_role_update'
        | 'project_role_delete'
        | 'project_apikey_read'
        | 'project_apikey_create'
        | 'project_apikey_update'
        | 'project_apikey_delete'
        | 'project_tracker_read'
        | 'project_tracker_update'
        | 'project_webhook_read'
        | 'project_webhook_create'
        | 'project_webhook_update'
        | 'project_webhook_delete'
        | 'channel_create'
        | 'channel_update'
        | 'channel_delete'
        | 'channel_field_read'
        | 'channel_field_update'
        | 'channel_image_read'
        | 'channel_image_update'
      )[];
      project: components['schemas']['RoleProjectDto'];
    };
    GetRolesByIdResponseDto: {
      roles: components['schemas']['RoleItemDto'][];
    };
    UpdateUserRequestDto: {
      name: string | null;
      department: string | null;
      /** @enum {string} */
      type?: 'SUPER' | 'GENERAL';
    };
    UserInvitationRequestDto: {
      email: string;
      /** @enum {string} */
      userType: 'SUPER' | 'GENERAL';
      roleId?: number;
    };
    ResetPasswordMailingRequestDto: {
      email: string;
    };
    ResetPasswordRequestDto: {
      email: string;
      code: string;
      password: string;
    };
    ChangePasswordRequestDto: {
      password: string;
      newPassword: string;
    };
    SetupTenantRequestDto: {
      siteName: string;
    };
    OAuthConfigRequestDto: {
      clientId: string;
      clientSecret: string;
      authCodeRequestURL: string;
      scopeString: string;
      accessTokenRequestURL: string;
      userProfileRequestURL: string;
      emailKey: string;
    };
    UpdateTenantRequestDto: {
      siteName: string;
      description: string | null;
      useEmail: boolean;
      isPrivate: boolean;
      isRestrictDomain: boolean;
      allowDomains: string[] | null;
      useOAuth: boolean;
      oauthConfig: components['schemas']['OAuthConfigRequestDto'] | null;
    };
    OAuthConfigResponseDto: {
      oauthUse: boolean;
      clientId: string;
      clientSecret: string;
      authCodeRequestURL: string;
      scopeString: string;
      accessTokenRequestURL: string;
      userProfileRequestURL: string;
      emailKey: string;
    };
    GetTenantResponseDto: {
      id: number;
      siteName: string;
      description: string | null;
      useEmail: boolean;
      useOAuth: boolean;
      isPrivate: boolean;
      isRestrictDomain: boolean;
      allowDomains: string[];
      useEmailVerification: boolean;
      oauthConfig: components['schemas']['OAuthConfigResponseDto'] | null;
    };
    CountFeedbacksByTenantIdResponseDto: {
      total: number;
    };
    GetAllRolesResponseRoleDto: {
      id: number;
      name: string;
      permissions: (
        | 'feedback_download_read'
        | 'feedback_update'
        | 'feedback_delete'
        | 'feedback_issue_update'
        | 'issue_create'
        | 'issue_update'
        | 'issue_delete'
        | 'project_update'
        | 'project_delete'
        | 'project_member_read'
        | 'project_member_create'
        | 'project_member_update'
        | 'project_member_delete'
        | 'project_role_read'
        | 'project_role_create'
        | 'project_role_update'
        | 'project_role_delete'
        | 'project_apikey_read'
        | 'project_apikey_create'
        | 'project_apikey_update'
        | 'project_apikey_delete'
        | 'project_tracker_read'
        | 'project_tracker_update'
        | 'project_webhook_read'
        | 'project_webhook_create'
        | 'project_webhook_update'
        | 'project_webhook_delete'
        | 'channel_create'
        | 'channel_update'
        | 'channel_delete'
        | 'channel_field_read'
        | 'channel_field_update'
        | 'channel_image_read'
        | 'channel_image_update'
      )[];
    };
    GetAllRolesResponseDto: {
      roles: components['schemas']['GetAllRolesResponseRoleDto'][];
      total: number;
    };
    CreateRoleRequestDto: {
      name: string;
      permissions: (
        | 'feedback_download_read'
        | 'feedback_update'
        | 'feedback_delete'
        | 'feedback_issue_update'
        | 'issue_create'
        | 'issue_update'
        | 'issue_delete'
        | 'project_update'
        | 'project_delete'
        | 'project_member_read'
        | 'project_member_create'
        | 'project_member_update'
        | 'project_member_delete'
        | 'project_role_read'
        | 'project_role_create'
        | 'project_role_update'
        | 'project_role_delete'
        | 'project_apikey_read'
        | 'project_apikey_create'
        | 'project_apikey_update'
        | 'project_apikey_delete'
        | 'project_tracker_read'
        | 'project_tracker_update'
        | 'project_webhook_read'
        | 'project_webhook_create'
        | 'project_webhook_update'
        | 'project_webhook_delete'
        | 'channel_create'
        | 'channel_update'
        | 'channel_delete'
        | 'channel_field_read'
        | 'channel_field_update'
        | 'channel_image_read'
        | 'channel_image_update'
      )[];
    };
    UpdateRoleRequestDto: {
      name: string;
      permissions: (
        | 'feedback_download_read'
        | 'feedback_update'
        | 'feedback_delete'
        | 'feedback_issue_update'
        | 'issue_create'
        | 'issue_update'
        | 'issue_delete'
        | 'project_update'
        | 'project_delete'
        | 'project_member_read'
        | 'project_member_create'
        | 'project_member_update'
        | 'project_member_delete'
        | 'project_role_read'
        | 'project_role_create'
        | 'project_role_update'
        | 'project_role_delete'
        | 'project_apikey_read'
        | 'project_apikey_create'
        | 'project_apikey_update'
        | 'project_apikey_delete'
        | 'project_tracker_read'
        | 'project_tracker_update'
        | 'project_webhook_read'
        | 'project_webhook_create'
        | 'project_webhook_update'
        | 'project_webhook_delete'
        | 'channel_create'
        | 'channel_update'
        | 'channel_delete'
        | 'channel_field_read'
        | 'channel_field_update'
        | 'channel_image_read'
        | 'channel_image_update'
      )[];
    };
    MemberUserDto: {
      id: number;
      email: string;
      name: string;
      department: string;
    };
    MemberRoleDto: {
      id: number;
      name: string;
      permissions: (
        | 'feedback_download_read'
        | 'feedback_update'
        | 'feedback_delete'
        | 'feedback_issue_update'
        | 'issue_create'
        | 'issue_update'
        | 'issue_delete'
        | 'project_update'
        | 'project_delete'
        | 'project_member_read'
        | 'project_member_create'
        | 'project_member_update'
        | 'project_member_delete'
        | 'project_role_read'
        | 'project_role_create'
        | 'project_role_update'
        | 'project_role_delete'
        | 'project_apikey_read'
        | 'project_apikey_create'
        | 'project_apikey_update'
        | 'project_apikey_delete'
        | 'project_tracker_read'
        | 'project_tracker_update'
        | 'project_webhook_read'
        | 'project_webhook_create'
        | 'project_webhook_update'
        | 'project_webhook_delete'
        | 'channel_create'
        | 'channel_update'
        | 'channel_delete'
        | 'channel_field_read'
        | 'channel_field_update'
        | 'channel_image_read'
        | 'channel_image_update'
      )[];
    };
    GetAllMember: {
      id: number;
      user: components['schemas']['MemberUserDto'];
      role: components['schemas']['MemberRoleDto'];
      /** Format: date-time */
      createdAt: string;
    };
    GetAllMemberResponseDto: {
      members: components['schemas']['GetAllMember'][];
      total: number;
    };
    CreateMemberRequestDto: {
      userId: number;
      roleId: number;
    };
    UpdateMemberRequestDto: {
      roleId: number;
    };
    CreateApiKeyRequestDto: {
      value?: string;
    };
    CreateApiKeyResponseDto: {
      id: number;
      value: string;
      /** Format: date-time */
      createdAt: string;
    };
    ApiKeyResponseDto: {
      id: number;
      value: string;
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      deletedAt: string;
    };
    FindApiKeysResponseDto: {
      items: components['schemas']['ApiKeyResponseDto'][];
    };
    ImageConfigRequestDto: {
      accessKeyId: string;
      secretAccessKey: string;
      endpoint: string;
      region: string;
      bucket: string;
      domainWhiteList: string[] | null;
    };
    /** @enum {string} */
    FieldFormatEnum:
      | 'text'
      | 'keyword'
      | 'number'
      | 'select'
      | 'multiSelect'
      | 'date'
      | 'images';
    /** @enum {string} */
    FieldPropertyEnum: 'READ_ONLY' | 'EDITABLE';
    /** @enum {string} */
    FieldStatusEnum: 'ACTIVE' | 'INACTIVE';
    CreateChannelRequestFieldSelectOptionDto: {
      id?: number;
      name: string;
      key: string;
    };
    CreateChannelRequestFieldDto: {
      name: string;
      key: string;
      description: string | null;
      format: components['schemas']['FieldFormatEnum'];
      property: components['schemas']['FieldPropertyEnum'];
      status: components['schemas']['FieldStatusEnum'];
      options?: components['schemas']['CreateChannelRequestFieldSelectOptionDto'][];
    };
    CreateChannelRequestDto: {
      name: string;
      description: string | null;
      imageConfig?: components['schemas']['ImageConfigRequestDto'] | null;
      fields: components['schemas']['CreateChannelRequestFieldDto'][];
    };
    CreateChannelResponseDto: {
      id: number;
    };
    ImageConfigResponseDto: {
      accessKeyId: string;
      secretAccessKey: string;
      endpoint: string;
      region: string;
      bucket: string;
      domainWhiteList: string[];
    };
    FindChannelsByProjectDto: {
      id: number;
      name: string;
      description: string;
      imageConfig: components['schemas']['ImageConfigResponseDto'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    FindChannelsByProjectIdResponseDto: {
      meta: components['schemas']['PaginationMetaDto'];
      items: components['schemas']['FindChannelsByProjectDto'][];
    };
    FindFieldsResponseSelectOptionDto: {
      id: number;
      name: string;
      key: string;
    };
    FindFieldsResponseDto: {
      id: number;
      /** @enum {string} */
      format:
        | 'text'
        | 'keyword'
        | 'number'
        | 'select'
        | 'multiSelect'
        | 'date'
        | 'images';
      /** @enum {string} */
      property: 'READ_ONLY' | 'EDITABLE';
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      name: string;
      key: string;
      description: string | null;
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
      options: components['schemas']['FindFieldsResponseSelectOptionDto'][];
    };
    FindChannelByIdResponseDto: {
      id: number;
      name: string;
      description: string;
      imageConfig: components['schemas']['ImageConfigResponseDto'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
      fields: components['schemas']['FindFieldsResponseDto'][];
    };
    UpdateChannelRequestDto: {
      name: string;
      description: string | null;
      imageConfig?: components['schemas']['ImageConfigRequestDto'] | null;
    };
    UpdateChannelRequestFieldDto: {
      name: string;
      key: string;
      description: string | null;
      format: components['schemas']['FieldFormatEnum'];
      property: components['schemas']['FieldPropertyEnum'];
      status: components['schemas']['FieldStatusEnum'];
      options?: components['schemas']['CreateChannelRequestFieldSelectOptionDto'][];
      id?: number;
    };
    UpdateChannelFieldsRequestDto: {
      fields: components['schemas']['UpdateChannelRequestFieldDto'][];
    };
    ImageUploadUrlTestRequestDto: {
      accessKeyId: string;
      secretAccessKey: string;
      endpoint: string;
      region: string;
      bucket: string;
    };
    ImageUploadUrlTestResponseDto: {
      success: boolean;
    };
    FindOptionByFieldIdResponseDto: {
      id: number;
      name: string;
      key: string;
    };
    CreateOptionRequestDto: {
      name: string;
      key: string;
    };
    CreateOptionResponseDto: {
      id: number;
    };
    TimezoneDto: {
      countryCode: string;
      name: string;
      offset: string;
    };
    CreateMemberByNameDto: {
      roleName: string;
      userId: number;
    };
    CreateApiKeyByValueDto: {
      value: string;
    };
    IssueTrackerDataDto: {
      ticketDomain: string | null;
      ticketKey: string | null;
    };
    CreateIssueTrackerRequestDto: {
      data: components['schemas']['IssueTrackerDataDto'];
    };
    CreateProjectRequestDto: {
      name: string;
      description: string | null;
      timezone: components['schemas']['TimezoneDto'];
      roles?: components['schemas']['CreateRoleRequestDto'][];
      members?: components['schemas']['CreateMemberByNameDto'][];
      apiKeys?: components['schemas']['CreateApiKeyByValueDto'][];
      issueTracker?: components['schemas']['CreateIssueTrackerRequestDto'];
    };
    CreateProjectResponseDto: {
      id: number;
    };
    FindProjectByIdResponseDto: {
      id: number;
      name: string;
      description: string;
      timezone: components['schemas']['TimezoneDto'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    FindProjectsResponseDto: {
      meta: components['schemas']['PaginationMetaDto'];
      items: components['schemas']['FindProjectByIdResponseDto'][];
    };
    CountFeedbacksByIdResponseDto: {
      total: number;
    };
    CountIssuesByIdResponseDto: {
      total: number;
    };
    UpdateProjectRequestDto: {
      name: string;
      description: string | null;
      timezone: components['schemas']['TimezoneDto'];
      roles?: components['schemas']['CreateRoleRequestDto'][];
      members?: components['schemas']['CreateMemberByNameDto'][];
      apiKeys?: components['schemas']['CreateApiKeyByValueDto'][];
      issueTracker?: components['schemas']['CreateIssueTrackerRequestDto'];
    };
    UpdateProjectResponseDto: {
      id: number;
    };
    Query: {
      /**
       * @description Search text for feedback data
       * @example payment
       */
      searchText?: string;
      /** @example {
       *       "gte": "2023-01-01",
       *       "lt": "2023-12-31"
       *     } */
      createdAt?: components['schemas']['TimeRange'];
      /** @example {
       *       "gte": "2023-01-01",
       *       "lt": "2023-12-31"
       *     } */
      updatedAt?: components['schemas']['TimeRange'];
    };
    FindFeedbacksByChannelIdRequestDto: {
      /**
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * @default 1
       * @example 1
       */
      page?: number;
      /** @description You can query by key-value with this object. (createdAt, updatedAt are kind of examples) If you want to search by text, you can use 'searchText' key. */
      query?: components['schemas']['Query'];
      /**
       * @description You can sort by specific feedback key with sort method values: 'ASC', 'DESC'
       * @example {
       *       "createdAt": "ASC"
       *     }
       */
      sort?: Record<string, unknown>;
    };
    Feedback: Record<string, unknown>;
    FindFeedbacksByChannelIdResponseDto: {
      meta: components['schemas']['PaginationMetaDto'];
      /** @example [
       *       {
       *         "id": 1,
       *         "name": "feedback",
       *         "issues": [
       *           {
       *             "id": 1,
       *             "name": "issue"
       *           }
       *         ]
       *       }
       *     ] */
      items: components['schemas']['Feedback'][];
    };
    AddIssueResponseDto: {
      /**
       * @description Issue id
       * @example 1
       */
      issueId: number;
      /**
       * @description Issue id
       * @example 1
       */
      feedbackId: number;
    };
    ExportFeedbacksRequestDto: {
      /**
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * @default 1
       * @example 1
       */
      page?: number;
      /** @description You can query by key-value with this object. (createdAt, updatedAt are kind of examples) If you want to search by text, you can use 'searchText' key. */
      query?: components['schemas']['Query'];
      /**
       * @description You can sort by specific feedback key with sort method values: 'ASC', 'DESC'
       * @example {
       *       "createdAt": "ASC"
       *     }
       */
      sort?: Record<string, unknown>;
      type: string;
      fieldIds?: number[];
    };
    DeleteFeedbacksRequestDto: {
      /**
       * @description Feedback ids in an array
       * @example [
       *       1,
       *       2
       *     ]
       */
      feedbackIds: number[];
    };
    CreateIssueRequestDto: {
      /**
       * @description Issue name
       * @example payment issue
       */
      name: string;
    };
    CreateIssueResponseDto: {
      /**
       * @description Issue id
       * @example 1
       */
      id: number;
    };
    FindIssueByIdResponseDto: {
      /**
       * @description Issue id
       * @example 1
       */
      id: number;
      /**
       * @description Issue Name
       * @example 1
       */
      name: string;
      /**
       * @description Issue description
       * @example This is a payment issue
       */
      description: string;
      /**
       * @description Issue status
       * @example IN_PROGRESS
       * @enum {string}
       */
      status: 'INIT' | 'ON_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'PENDING';
      /**
       * @description External Issue Id
       * @example 123
       */
      externalIssueId: string;
      /**
       * @description Feedback count of the issue
       * @example 100
       */
      feedbackCount: number;
      /**
       * Format: date-time
       * @description Created datetime of the issue
       * @example 2023-01-01T00:00:00.000Z
       */
      createdAt: string;
      /**
       * Format: date-time
       * @description Updated datetime of the issue
       * @example 2023-01-01T00:00:00.000Z
       */
      updatedAt: string;
    };
    FindIssuesByProjectIdRequestDto: {
      /**
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * @description You can query by key-value with this object. If you want to search by text, you can use 'searchText' key.
       * @example {
       *       "name": "issue name"
       *     }
       */
      query?: Record<string, unknown>;
      /**
       * @description You can sort by specific feedback key with sort method values: 'ASC', 'DESC'
       * @example {
       *       "createdAt": "ASC"
       *     }
       */
      sort?: Record<string, unknown>;
    };
    FindIssuesByProjectIdResponseDto: {
      meta: components['schemas']['PaginationMetaDto'];
      items: components['schemas']['FindIssueByIdResponseDto'][];
    };
    UpdateIssueRequestDto: {
      /**
       * @description Issue name
       * @example payment issue
       */
      name: string;
      /**
       * @description Issue description
       * @example This is a payment issue
       */
      description: string | null;
      /**
       * @description Issue status
       * @example IN_PROGRESS
       * @enum {string}
       */
      status?: 'INIT' | 'ON_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'PENDING';
      /**
       * @description External Issue Id
       * @example 123
       */
      externalIssueId?: string;
    };
    DeleteIssuesRequestDto: {
      /**
       * @description Issue ids in an array to delete in chunk
       * @example [
       *       1,
       *       2,
       *       3
       *     ]
       */
      issueIds: number[];
    };
    FindCountResponseDto: {
      count: number;
    };
    IssueStatistics: {
      startDate: string;
      endDate: string;
      count: number;
    };
    FindCountByDateResponseDto: {
      statistics: components['schemas']['IssueStatistics'][];
    };
    IssueStatusStatistics: {
      status: string;
      count: number;
    };
    FindCountByStatusResponseDto: {
      statistics: components['schemas']['IssueStatusStatistics'][];
    };
    StatisticData: {
      startDate: string;
      endDate: string;
      count: number;
    };
    ChannelStatisticData: {
      id: number;
      name: string;
      statistics: components['schemas']['StatisticData'][];
    };
    FindCountByDateByChannelResponseDto: {
      channels: components['schemas']['ChannelStatisticData'][];
    };
    FindIssuedRateResponseDto: {
      ratio: number;
    };
    IssueStatisticData: {
      startDate: string;
      endDate: string;
      feedbackCount: number;
    };
    IssueStatistic: {
      id: number;
      name: string;
      statistics: components['schemas']['IssueStatisticData'][];
    };
    FindCountByDateByIssueResponseDto: {
      issues: components['schemas']['IssueStatistic'][];
    };
    CreateIssueTrackerResponseDto: {
      id: number;
      data: components['schemas']['IssueTrackerDataDto'];
      /** Format: date-time */
      createdAt: string;
    };
    FindIssueTrackerResponseDto: {
      id: number;
      data: components['schemas']['IssueTrackerDataDto'];
    };
    UpdateIssueTrackerRequestDto: {
      data: components['schemas']['IssueTrackerDataDto'];
    };
    UpdateIssueTrackerResponseDto: {
      id: number;
      data: components['schemas']['IssueTrackerDataDto'];
      /** Format: date-time */
      createdAt: string;
    };
    EventDto: {
      /** @enum {string} */
      type:
        | 'FEEDBACK_CREATION'
        | 'ISSUE_CREATION'
        | 'ISSUE_STATUS_CHANGE'
        | 'ISSUE_ADDITION';
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      channelIds: number[];
    };
    CreateWebhookRequestDto: {
      name: string;
      url: string;
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      events: components['schemas']['EventDto'][];
    };
    CreateWebhookResponseDto: {
      id: number;
    };
    GetWebhookResponseEventDto: {
      id: number;
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      /** @enum {string} */
      type:
        | 'FEEDBACK_CREATION'
        | 'ISSUE_CREATION'
        | 'ISSUE_STATUS_CHANGE'
        | 'ISSUE_ADDITION';
      channels: components['schemas']['FindChannelByIdResponseDto'][];
      /** Format: date-time */
      createdAt: string;
    };
    GetWebhookByIdResponseDto: {
      id: number;
      name: string;
      url: string;
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      events: components['schemas']['GetWebhookResponseEventDto'][];
      /** Format: date-time */
      createdAt: string;
    };
    GetWebhooksByProjectIdResponseDto: {
      items: components['schemas']['GetWebhookByIdResponseDto'][];
    };
    UpdateWebhookRequestDto: {
      name: string;
      url: string;
      /** @enum {string} */
      status: 'ACTIVE' | 'INACTIVE';
      events: components['schemas']['EventDto'][];
    };
    UpdateWebhookResponseDto: {
      id: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  AuthController_sendCode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EmailVerificationMailingRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['SendEmailCodeResponseDto'];
        };
      };
    };
  };
  AuthController_verifyEmailCode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EmailVerificationCodeRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  AuthController_signUpEmailUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EmailUserSignUpRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  AuthController_signUpInvitationUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['InvitationUserSignUpRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  AuthController_signUpOAuthUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['OAuthUserSignUpRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  AuthController_signInEmail: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EmailUserSignInRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['SignInResponseDto'];
        };
      };
    };
  };
  AuthController_redirectToLoginURL: {
    parameters: {
      query?: {
        callback_url?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['OAuthLoginUrlResponseDto'];
        };
      };
    };
  };
  AuthController_handleCallback: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  AuthController_refreshToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['SignInResponseDto'];
        };
      };
    };
  };
  UserController_getAllUsers: {
    parameters: {
      query?: {
        /** @example 10 */
        limit?: number;
        /** @example 1 */
        page?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetAllUserResponseDto'];
        };
      };
    };
  };
  UserController_deleteUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DeleteUsersRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_searchUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['GetAllUsersRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetAllUserResponseDto'];
        };
      };
    };
  };
  UserController_getUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['UserDto'];
        };
      };
    };
  };
  UserController_updateUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateUserRequestDto'];
      };
    };
    responses: {
      204: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_deleteUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_getRoles: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetRolesByIdResponseDto'];
        };
      };
    };
  };
  UserController_inviteUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UserInvitationRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_requestResetPassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ResetPasswordMailingRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_resetPassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ResetPasswordRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  UserController_changePassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ChangePasswordRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  TenantController_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetTenantResponseDto'];
        };
      };
    };
  };
  TenantController_update: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateTenantRequestDto'];
      };
    };
    responses: {
      204: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  TenantController_setup: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['SetupTenantRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  TenantController_countFeedbacks: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        tenantId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CountFeedbacksByTenantIdResponseDto'];
        };
      };
    };
  };
  RoleController_getAllRolesByProjectId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetAllRolesResponseDto'];
        };
      };
    };
  };
  RoleController_createRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateRoleRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  RoleController_updateRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
        roleId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateRoleRequestDto'];
      };
    };
    responses: {
      204: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  RoleController_deleteRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        roleId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  MemberController_getAllRolesByProjectId: {
    parameters: {
      query: {
        createdAt: string;
      };
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetAllMemberResponseDto'];
        };
      };
    };
  };
  MemberController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateMemberRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  MemberController_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        memberId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateMemberRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  MemberController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        memberId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ApiKeyController_findAll: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindApiKeysResponseDto'];
        };
      };
    };
  };
  ApiKeyController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateApiKeyRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateApiKeyResponseDto'];
        };
      };
    };
  };
  ApiKeyController_softDelete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        apiKeyId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ApiKeyController_recover: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        apiKeyId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ApiKeyController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        apiKeyId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ChannelController_findAllByProjectId: {
    parameters: {
      query?: {
        /** @example 10 */
        limit?: number;
        /** @example 1 */
        page?: number;
        searchText?: string;
      };
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindChannelsByProjectIdResponseDto'];
        };
      };
    };
  };
  ChannelController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateChannelRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateChannelResponseDto'];
        };
      };
    };
  };
  ChannelController_checkName: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': boolean;
        };
      };
    };
  };
  ChannelController_findOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindChannelByIdResponseDto'];
        };
      };
    };
  };
  ChannelController_updateOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateChannelRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ChannelController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ChannelController_updateFields: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateChannelFieldsRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ChannelController_getImageUploadUrlTest: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ImageUploadUrlTestRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['ImageUploadUrlTestResponseDto'];
        };
      };
    };
  };
  OptionController_getOptions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        fieldId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindOptionByFieldIdResponseDto'][];
        };
      };
    };
  };
  OptionController_createOption: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        fieldId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateOptionRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateOptionResponseDto'];
        };
      };
    };
  };
  ProjectController_findAll: {
    parameters: {
      query?: {
        /** @example 10 */
        limit?: number;
        /** @example 1 */
        page?: number;
        searchText?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindProjectsResponseDto'];
        };
      };
    };
  };
  ProjectController_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateProjectRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateProjectResponseDto'];
        };
      };
    };
  };
  ProjectController_checkName: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ProjectController_findOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindProjectByIdResponseDto'];
        };
      };
    };
  };
  ProjectController_updateOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateProjectRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['UpdateProjectResponseDto'];
        };
      };
    };
  };
  ProjectController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  ProjectController_countFeedbacks: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CountFeedbacksByIdResponseDto'];
        };
      };
    };
  };
  ProjectController_countIssues: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CountIssuesByIdResponseDto'];
        };
      };
    };
  };
  FeedbackController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
        channelId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  FeedbackController_deleteMany: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DeleteFeedbacksRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  FeedbackController_findByChannelId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FindFeedbacksByChannelIdRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindFeedbacksByChannelIdResponseDto'];
        };
      };
    };
  };
  FeedbackController_addIssue: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        feedbackId: number;
        issueId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['AddIssueResponseDto'];
        };
      };
    };
  };
  FeedbackController_removeIssue: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        feedbackId: number;
        issueId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['AddIssueResponseDto'];
        };
      };
    };
  };
  FeedbackController_exportFeedbacks: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ExportFeedbacksRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  FeedbackController_updateFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        channelId: number;
        feedbackId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  IssueController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateIssueRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateIssueResponseDto'];
        };
      };
    };
  };
  IssueController_deleteMany: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DeleteIssuesRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  IssueController_findById: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        issueId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindIssueByIdResponseDto'][];
        };
      };
    };
  };
  IssueController_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
        issueId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateIssueRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  IssueController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        issueId: number;
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content?: never;
      };
    };
  };
  IssueController_findAllByProjectId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FindIssuesByProjectIdRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindIssuesByProjectIdResponseDto'];
        };
      };
    };
  };
  IssueStatisticsController_getCount: {
    parameters: {
      query: {
        from: string;
        to: string;
        projectId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountResponseDto'];
        };
      };
    };
  };
  IssueStatisticsController_getCountByDate: {
    parameters: {
      query: {
        startDate: string;
        endDate: string;
        interval: string;
        projectId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountByDateResponseDto'];
        };
      };
    };
  };
  IssueStatisticsController_getCountByStatus: {
    parameters: {
      query: {
        projectId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountByStatusResponseDto'];
        };
      };
    };
  };
  FeedbackStatisticsController_getCountByDateByChannel: {
    parameters: {
      query: {
        startDate: string;
        endDate: string;
        interval: string;
        channelIds: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountByDateByChannelResponseDto'];
        };
      };
    };
  };
  FeedbackStatisticsController_getCount: {
    parameters: {
      query: {
        from: string;
        to: string;
        projectId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountResponseDto'];
        };
      };
    };
  };
  FeedbackStatisticsController_getIssuedRatio: {
    parameters: {
      query: {
        from: string;
        to: string;
        projectId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindIssuedRateResponseDto'];
        };
      };
    };
  };
  FeedbackIssueStatisticsController_getCountByDateByIssue: {
    parameters: {
      query: {
        startDate: string;
        endDate: string;
        interval: string;
        issueIds: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindCountByDateByIssueResponseDto'];
        };
      };
    };
  };
  IssueTrackerController_findOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['FindIssueTrackerResponseDto'];
        };
      };
    };
  };
  IssueTrackerController_updateOne: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateIssueTrackerRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['UpdateIssueTrackerResponseDto'];
        };
      };
    };
  };
  IssueTrackerController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateIssueTrackerRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateIssueTrackerResponseDto'];
        };
      };
    };
  };
  WebhookController_getByProjectId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetWebhooksByProjectIdResponseDto'];
        };
      };
    };
  };
  WebhookController_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateWebhookRequestDto'];
      };
    };
    responses: {
      201: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['CreateWebhookResponseDto'];
        };
      };
    };
  };
  WebhookController_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        webhookId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetWebhookByIdResponseDto'];
        };
      };
    };
  };
  WebhookController_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        projectId: number;
        webhookId: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateWebhookRequestDto'];
      };
    };
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['UpdateWebhookResponseDto'];
        };
      };
    };
  };
  WebhookController_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        webhookId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: Record<string, unknown>;
        content: {
          'application/json': components['schemas']['GetWebhookByIdResponseDto'];
        };
      };
    };
  };
}
