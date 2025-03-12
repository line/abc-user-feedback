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

import type { FieldInfo, FieldProperty } from './field.type';

export const isDefaultField = (field: FieldInfo) =>
  field.key === 'id' ||
  field.key === 'createdAt' ||
  field.key === 'updatedAt' ||
  field.key === 'issues';

export const sortField = (a: FieldInfo, b: FieldInfo) => {
  return a.order - b.order;
};

export const FIELD_PROPERTY_TEXT: Record<FieldProperty, string> = {
  READ_ONLY: 'Read Only',
  EDITABLE: 'Editable',
};
