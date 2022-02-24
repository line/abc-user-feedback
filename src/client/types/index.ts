/* */
import { O } from 'ts-toolbelt'

/* */
import { paths } from './spec'

export type OAIPathKeys = keyof paths

export type OAIMethods = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'head'

export type OAIMethodPathKeys<TMethod extends OAIMethods> = O.SelectKeys<
  paths,
  Record<TMethod, unknown>
>

export type OAIPathParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods
> = O.Path<paths, [TPath, TMethod, 'parameters', 'path']>

export type OAIQueryParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods
> = O.Path<paths, [TPath, TMethod, 'parameters', 'query']>

export type OAIParameters<
  TPath extends OAIPathKeys,
  TMethod extends OAIMethods
> = OAIPathParameters<TPath, TMethod> extends Record<string, unknown>
  ? OAIQueryParameters<TPath, TMethod> extends Record<string, unknown>
    ? O.Merge<
        OAIPathParameters<TPath, TMethod>,
        OAIQueryParameters<TPath, TMethod>
      >
    : OAIPathParameters<TPath, TMethod>
  : OAIQueryParameters<TPath, TMethod> extends Record<string, unknown>
  ? OAIQueryParameters<TPath, TMethod>
  : undefined

export type OAIResponse<
  TPath extends keyof paths,
  TMethod extends OAIMethods
> = O.Path<
  paths,
  [TPath, TMethod, 'responses', 200, 'content', 'application/json']
>
