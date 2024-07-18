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
import type { AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';

import { env } from '@/env';
import { createNextApiHandler } from '@/server/api-handler';
import type { JwtSession } from '@/server/iron-option';
import { ironOption } from '@/server/iron-option';
import getLogger from '@/server/logger';
import type { Jwt } from '@/shared';

const handler = createNextApiHandler({
  GET: async (req, res) => {
    const session = await getIronSession<JwtSession>(req, res, ironOption);

    if (!session.jwt) return res.status(400).end();

    try {
      const { status, data } = await axios.get<Jwt>(
        `${env.API_BASE_URL}/api/admin/auth/refresh`,
        { headers: { Authorization: `Bearer ${session.jwt.refreshToken}` } },
      );

      if (status !== 200) return res.status(status).send(data);

      session.jwt = data;
      await session.save();

      return res.send(data);
    } catch (error) {
      getLogger('/api/refrech-jwt').error(error);
      if (error instanceof TypeError) {
        return res
          .status(500)
          .send({ message: error.message, code: error.name });
      } else if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response as AxiosResponse<
          unknown,
          unknown
        >;
        return res.status(status).send(data);
      }
      return res.status(500).send({ message: 'Unknown Error' });
    }
  },
});

export default handler;
