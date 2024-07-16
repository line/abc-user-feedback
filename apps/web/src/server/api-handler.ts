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
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const METHOD_LIST = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
] as const;

type Method = (typeof METHOD_LIST)[number];

type CustomNextApiRequest<T = Record<string, unknown>> = Omit<
  NextApiRequest,
  'body'
> & { body: T };

type CustomNextApiHandler<T extends Zod.ZodType> = (
  req: CustomNextApiRequest<T['_output']>,
  res: NextApiResponse,
) => unknown | Promise<unknown>;

const handler =
  <T extends Zod.ZodType>(schema?: T) =>
  (input: CustomNextApiHandler<T>) => {
    if (!schema) return input;

    return async (req: NextApiRequest, res: NextApiResponse) => {
      const { success, error, data } = schema.safeParse(req.body);
      req.body = data;
      if (success) return input(req, res);

      return res
        .status(400)
        .json({ error: { message: 'Invalid request', error } });
    };
  };

export const procedure = {
  input: <T extends Zod.ZodType>(schema?: T) => ({ handle: handler(schema) }),
  handle: handler(),
};

export const createNextApiHandler = (
  input: Partial<Record<Method, NextApiHandler>>,
) => {
  return (async (req, res) => {
    const handler = input[req.method?.toUpperCase() as Method];

    if (!handler) return res.status(405).send('Method not allowed');
    return handler(req, res);
  }) as NextApiHandler;
};
