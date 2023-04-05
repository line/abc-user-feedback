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
import { PermissionEnum } from './permission.enum';

export const OWNER_ROLE_DEFAULT_ID = 'f7bb5cfb-a465-49d4-b62b-31f7e4a4b5fc';
export const GUEST_ROLE_DEFAULT_ID = 'f7bb5cfb-a465-49d4-b62b-31f7e4a4b5fd';

export enum DefaultRole {
  Owner = 'owner',
  Guest = 'guest',
}

export const OWNER_ROLE = {
  id: OWNER_ROLE_DEFAULT_ID,
  name: DefaultRole.Owner,
  permissions: Object.values(PermissionEnum),
};

export const GUEST_ROLE = {
  id: GUEST_ROLE_DEFAULT_ID,
  name: DefaultRole.Guest,
  permissions: [],
};
