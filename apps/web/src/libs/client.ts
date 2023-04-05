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
import type {
  OAIMethodPathKeys,
  OAIMutationResponse,
  OAIPathParameters,
  OAIQueryParameters,
  OAIRequestBody,
  OAIResponse,
} from '@/types/openapi.type';
import axios, { AxiosRequestConfig } from 'axios';
import decodeJWT from 'jwt-decode';

import isServer from '@/constants/is-server';
import { PATH } from '@/constants/path';
import { IJwtPaylod } from '@/types/jwt-payload.type';
import { getRequestUrl } from '@/utils/path-parsing';

import { AsyncQueue } from './async-queue';
import sessionStorage from './session-storage';

const isValidToken = (token: string) => {
  const claims: IJwtPaylod = decodeJWT(token);
  const expirationTimeInSeconds = claims.exp * 1000;
  const now = new Date();
  const isValid = expirationTimeInSeconds >= now.getTime();
  return isValid;
};

class client {
  private axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL,
  });
  private requestQueue = new AsyncQueue();

  private static instance: client;
  public static get Instance(): client {
    return this.instance || (this.instance = new this());
  }

  constructor() {
    this.axiosInstance.interceptors.request.use(async (config) => {
      await this.requestQueue.wait();

      if (isServer) {
        this.requestQueue.shift();
        return config;
      }

      const jwt = sessionStorage.getItem('jwt');

      if (!jwt) {
        this.requestQueue.shift();
        return config;
      }

      const { accessToken, refreshToken } = jwt;

      if (!isValidToken(accessToken)) {
        if (refreshToken && isValidToken(refreshToken)) {
          try {
            const { data } = await axios.get('/api/refresh-jwt');
            sessionStorage.setItem('jwt', data.jwt);
          } catch (error) {
            await axios.get('/api/logout');
            sessionStorage.removeItem('jwt');
            this.requestQueue.abortAll();
            window.location.assign(PATH.AUTH.SIGN_IN);
          }
        } else {
          await axios.get('/api/logout');
          sessionStorage.removeItem('jwt');
          this.requestQueue.abortAll();
          window.location.assign(PATH.AUTH.SIGN_IN);
        }
      }

      this.requestQueue.shift();

      const token = sessionStorage.getItem('jwt');

      if (token) {
        config.headers.setAuthorization(`Bearer ${token.accessToken}`);
      }

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error.response?.data ?? error),
    );
  }
  request<D>(config: AxiosRequestConfig<D>) {
    return this.axiosInstance.request(config);
  }

  get<
    TPath extends OAIMethodPathKeys<'get'>,
    TPathParams extends OAIPathParameters<TPath, 'get'>,
    TQuery extends OAIQueryParameters<TPath, 'get'>,
    TResponse extends OAIResponse<TPath, 'get'>,
  >({
    path,
    pathParams,
    query,
    options,
  }: { path: TPath } & (TPathParams extends undefined
    ? { pathParams?: TPathParams }
    : { pathParams: TPathParams }) &
    (TQuery extends undefined ? { query?: any } : { query: TQuery }) & {
      options?: Omit<AxiosRequestConfig, 'params'>;
    }) {
    return this.axiosInstance.get<TResponse>(getRequestUrl(path, pathParams), {
      params: query,
      ...options,
    });
  }

  delete<
    TPath extends OAIMethodPathKeys<'delete'>,
    TPathParams extends OAIPathParameters<TPath, 'delete'>,
    TResponse extends OAIResponse<TPath, 'delete'>,
  >({
    path,
    pathParams,
  }: { path: TPath } & (TPathParams extends undefined
    ? { pathParams?: undefined }
    : { pathParams: TPathParams })) {
    return this.axiosInstance.delete<TResponse>(
      getRequestUrl(path, pathParams),
    );
  }

  post<
    TPath extends OAIMethodPathKeys<'post'>,
    TPathParams extends OAIPathParameters<TPath, 'post'>,
    TBody extends OAIRequestBody<TPath, 'post'>,
    TResponse extends OAIMutationResponse<TPath, 'post'>,
  >({
    path,
    pathParams,
    body,
    config,
  }: {
    path: TPath;
    config?: AxiosRequestConfig;
  } & (TPathParams extends undefined
    ? { pathParams?: undefined }
    : { pathParams: TPathParams }) &
    (TBody extends undefined ? { body?: undefined } : { body: TBody })) {
    return this.axiosInstance.post<TResponse>(
      getRequestUrl(path, pathParams),
      body,
      config,
    );
  }

  put<
    TPath extends OAIMethodPathKeys<'put'>,
    TPathParams extends OAIPathParameters<TPath, 'put'>,
    TBody extends OAIRequestBody<TPath, 'put'>,
    TResponse extends OAIResponse<TPath, 'put'>,
  >({
    path,
    pathParams,
    body,
  }: { path: TPath } & (TPathParams extends undefined
    ? { pathParams?: undefined }
    : { pathParams: TPathParams }) &
    (TBody extends undefined ? { body?: undefined } : { body: TBody })) {
    return this.axiosInstance.put<TResponse>(
      getRequestUrl(path, pathParams),
      body,
    );
  }

  patch<
    TPath extends OAIMethodPathKeys<'patch'>,
    TPathParams extends OAIPathParameters<TPath, 'patch'>,
    TBody extends OAIRequestBody<TPath, 'patch'>,
    TResponse extends OAIResponse<TPath, 'patch'>,
  >({
    path,
    pathParams,
    body,
  }: { path: TPath } & (TPathParams extends undefined
    ? { pathParams?: undefined }
    : { pathParams: TPathParams }) &
    (TBody extends undefined ? { body?: undefined } : { body: TBody })) {
    return this.axiosInstance.patch<TResponse>(
      getRequestUrl(path, pathParams),
      body,
    );
  }
}

export default client.Instance;
