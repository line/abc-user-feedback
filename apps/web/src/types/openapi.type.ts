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
> = O.Path<paths, [TPath, TMethod, 'parameters', 'path']>;


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
> = OAIPathParameters<TPath, TMethod> extends Record<string, unknown>
  ? OAIQueryParameters<TPath, TMethod> extends Record<string, unknown>
    ? O.Merge<
        OAIPathParameters<TPath, TMethod>,
        OAIQueryParameters<TPath, TMethod>
      >
    : OAIPathParameters<TPath, TMethod>
  : OAIQueryParameters<TPath, TMethod> extends Record<string, unknown> | undefined
  ? OAIQueryParameters<TPath, TMethod>
  : undefined;

  const a: OAIQueryParameters<'/api/auth/signIn/oauth/loginURL', 'get'> = {}

export type OAIResponse<TPath extends keyof paths, TMethod extends OAIMethods> =
  O.Path<
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
