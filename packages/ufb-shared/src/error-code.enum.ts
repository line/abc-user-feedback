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
const Tenant = {
  TenantNotFound: 'TenantNotFound',
  TenantAlreadyExists: 'TenantAlreadyExists',
};

const User = {
  UserAlreadyExists: 'UserAlreadyExists',
  UserNotFound: 'UserNotFound',
  PasswordNotMatched: 'PasswordNotMatched',
  EmailVerification: 'EmailVerification',
  EmailNotVerified: 'EmailNotVerified',
  PrivateServiceUserCreate: 'PrivateServiceUserCreate',
  NotAllowDomain: 'NotAllowDomain',
  InvalidCode: 'InvalidCode',
  InvalidPassword: 'InvalidPassword',
};
const Auth = {
  PasswordNotMatch: 'PasswordNotMatch',
  BlockedUser: 'BlockedUser',
};

const Role = {
  RoleNotFound: 'RoleNotFound',
  OwnerIsImmutable: 'OwnerIsImmutable',
  RoleAlreadyExists: 'RoleAlreadyExists',
};

const Mailing = {
  NotVerifiedEmail: 'NotVerifiedEmail',
  InvalidEmailCode: 'InvalidEmailCode',
};

const Common = {
  InvalidDateFormat: 'InvalidDateFormat',
};

const Project = {
  ProjectAlreadyExists: 'ProjectAlreadyExists',
  ProjectNotFound: 'ProjectNotFound',
  ProjectInvalidName: 'ProjectInvalidName',
};

const Channel = {
  ChannelAlreadyExists: 'ChannelAlreadyExists',
  ChannelNotFound: 'ChannelNotFound',
  ChannelInvalidName: 'ChannelInvalidName',
};

const Issue = {
  IssueNameDuplicated: 'IssueNameDuplicated',
  IssueInvalidName: 'IssueInvalidName',
  IssueNotFound: 'IssueNotFound',
};

const Category = {
  CategoryNameDuplicated: 'CategoryNameDuplicated',
  CategoryNameInvalid: 'CategoryNameInvalid',
  CategoryNotFound: 'CategoryNotFound',
};

const Field = {
  FieldNameDuplicated: 'FieldNameDuplicated',
  FieldKeyDuplicated: 'FieldKeyDuplicated',
};

const Option = {
  OptionNameDuplicated: 'OptionNameDuplicated',
  OptionKeyDuplicated: 'OptionKeyDuplicated',
};

const Feedback = {
  InvalidExpressionFormat: 'InvalidExpressionFormat',
  InvalidFieldType: 'InvalidFieldType',
  InvalidFieldRequest: 'InvalidFieldRequest',
};

const Member = {
  MemberAlreadyExists: 'MemberAlreadyExists',
  MemberNotFound: 'MemberNotFound',
  MemberUpdateRoleNotMatchedProject: 'MemberUpdateRoleNotMatchedProject',
  MemberInvalidUser: 'MemberInvalidUser',
};

const Opensearch = {
  LargeWindow: 'LargeWindow',
};

const Webhook = {
  WebhookAlreadyExists: 'WebhookAlreadyExists',
  WebhookNotFound: 'WebhookNotFound',
};

export const ErrorCode = {
  Tenant,
  Role,
  User,
  Auth,
  Mailing,
  Common,
  Feedback,
  Project,
  Channel,
  Issue,
  Category,
  Field,
  Option,
  Member,
  Opensearch,
  Webhook,
};

export type ErrorCode = typeof ErrorCode;
