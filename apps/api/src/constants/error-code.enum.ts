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

const Field = {
  FieldNameDuplicated: 'FieldNameDuplicated',
};
const Option = {
  OptionNameDuplicated: 'OptionNameDuplicated',
};
const Feedback = {
  InvalidExpressionFormat: 'InvalidExpressionFormat',
  InvalidFieldType: 'InvalidFieldType',
  InvalidFieldRequest: 'InvalidFieldRequest',
  NotFoundAddressInfo: 'NotFoundAddressInfo',
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
  Field,
  Option,
};

export type ErrorCode = typeof ErrorCode;
