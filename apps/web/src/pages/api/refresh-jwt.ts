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
import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOption } from '@/constants/iron-option';
import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';

export default withIronSessionApiRoute(async (req, res) => {
  const { jwt } = req.session;
  if (!jwt) res.status(400).end();

  const response = await fetch(`${process.env.API_BASE_URL}/api/auth/refresh`, {
    method: 'get',
    headers: { Authorization: `Bearer ${jwt?.refreshToken}` },
  });

  const data = await response.json();
  if (response.status !== 200) {
    return res.status(response.status).send(data);
  }

  req.session.jwt = data;
  await req.session.save();
  res.send({ jwt: data });
}, ironOption);
