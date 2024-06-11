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
import type { NextApiHandler } from 'next';
import axios, { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';

import type { JwtSession } from '@/constants/iron-option';
import { ironOption } from '@/constants/iron-option';
import { env } from '@/env.mjs';
import getLogger from '@/libs/logger';

const handler: NextApiHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await axios.post(
      `${env.API_BASE_URL}/api/admin/auth/signIn/email`,
      { email, password },
    );

    if (response.status !== 201) {
      return res.status(response.status).send(response.data);
    }
    const session = await getIronSession<JwtSession>(req, res, ironOption);

    session.jwt = response.data;
    await session.save();

    return res.send(response.data);
  } catch (error) {
    if (error instanceof TypeError) {
      getLogger('/api/login').error(error);
      return res.status(500).send({ message: error.message, code: error.name });
    } else if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      getLogger('/api/login').error(error.response);
      return res.status(status).send(data);
    } else if (error instanceof Error) {
      const { message, name, cause, stack } = error;
      getLogger('/api/login').error({ message, name, cause, stack });
    }
    return res.status(500).send({ message: 'Unknown Error' });
  }
};

export default handler;
