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

import type { GetServerSideProps } from 'next';

import { Path } from '@/shared';

interface IProps {
  projectId: number;
}

const SettingPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  query,
}) => {
  return new Promise((resove) =>
    resove({
      redirect: {
        destination: Path.SETTINGS.replace(
          '[projectId]',
          String(query.projectId),
        ),
        permanent: true,
      },
    }),
  );
};

export default SettingPage;
