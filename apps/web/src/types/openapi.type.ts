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
import type { O } from 'ts-toolbelt';

import type { paths } from '@/types/api.type';

export type OAIPathKeys = keyof paths;
export type OAIMethods = 'get' | 'put' | 'post' | 'delete' | 'patch';

export type OAIMethodPathKeys<TMethod extends OAIMethods> = O.SelectKeys<
  paths,
  Record<TMethod, unknown>
>;

export type OAIPathParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods,
> =
  O.Path<paths, [TPath, TMethod, 'parameters', 'path']> extends Record<
    string,
    unknown
  >
    ? O.Path<paths, [TPath, TMethod, 'parameters', 'path']>
    : undefined;

export type OAIQueryParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods,
> = O.Path<paths, [TPath, TMethod, 'parameters', 'query']>;

export type OAIRequestBody<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods,
> = O.Path<
  paths,
  [TPath, TMethod, 'requestBody', 'content', 'application/json']
>;

export type OAIParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods,
> =
  OAIPathParameters<TPath, TMethod> extends Record<string, unknown>
    ? OAIQueryParameters<TPath, TMethod> extends Record<string, unknown>
      ? O.Merge<
          OAIPathParameters<TPath, TMethod>,
          OAIQueryParameters<TPath, TMethod>
        >
      : OAIPathParameters<TPath, TMethod>
    : OAIQueryParameters<TPath, TMethod> extends
          | Record<string, unknown>
          | undefined
      ? OAIQueryParameters<TPath, TMethod>
      : undefined;

export type OAIResponse<
  TPath extends keyof paths,
  TMethod extends OAIMethods,
> = O.Path<
  paths,
  [TPath, TMethod, 'responses', 200, 'content', 'application/json']
>;

export type OAIMutationResponse<
  TPath extends keyof paths,
  TMethod extends OAIMethods,
> = O.Path<
  paths,
  | [TPath, TMethod, 'responses', 201, 'content', 'application/json']
  | [TPath, TMethod, 'responses', 200, 'content', 'application/json']
>;
