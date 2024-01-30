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
import axios, { AxiosError } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOption } from '@/constants/iron-option';
import { env } from '@/env.mjs';
import getLogger from '@/libs/logger';

export default withIronSessionApiRoute(async (req, res) => {
  const { jwt } = req.session;
  if (!jwt) return res.status(400).end();

  try {
    const response = await axios.get(
      `${env.API_BASE_URL}/api/admin/auth/refresh`,
      { headers: { Authorization: `Bearer ${jwt?.refreshToken}` } },
    );

    if (response.status !== 200) {
      return res.status(response.status).send(response.data);
    }

    req.session.jwt = response.data;
    await req.session.save();
    return res.send({ jwt: response.data });
  } catch (error) {
    getLogger('/api/refrech-jwt').error(error);
    if (error instanceof TypeError) {
      return res.status(500).send({ message: error.message, code: error.name });
    } else if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      return res.status(status).send(data);
    }
    return res.status(500).send({ message: 'Unknown Error' });
  }
}, ironOption);
