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
import { getIronSession } from 'iron-session';

import type { JwtSession } from '@/constants/iron-option';
import { ironOption } from '@/constants/iron-option';
import { env } from '@/env.mjs';
import getLogger from '@/libs/logger';

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.body;

  try {
    const params = new URLSearchParams({ code });
    const response = await fetch(
      `${env.API_BASE_URL}/api/admin/auth/signIn/oauth?${params}`,
    );

    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).send(data);
    }
    const session = await getIronSession<JwtSession>(req, res, ironOption);

    session.jwt = data;
    await session.save();

    return res.send(data);
  } catch (error) {
    getLogger('/api/oauth').error(error);
    if (error instanceof TypeError) {
      return res.status(500).send({ message: error.message, code: error.name });
    }
    return res.status(500).send({ message: 'Unknown Error' });
  }
};

export default handler;
