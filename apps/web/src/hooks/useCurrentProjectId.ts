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
import { useMemo } from 'react';
import { useRouter } from 'next/router';

const useCurrentProjectId = () => {
  const router = useRouter();

  const projectId = useMemo(() => {
    if (!router.query?.projectId) return -1;
    return parseInt(router.query.projectId as string) as number;
  }, [router]);

  const changeProjectId = (projectId: number) => {
    router.push({ pathname: router.pathname, query: { projectId } });
  };

  return { projectId, changeProjectId };
};
export default useCurrentProjectId;
