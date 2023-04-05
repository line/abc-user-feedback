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
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { UrlObject } from 'url';

import { removeNull } from '@/utils/common';

const useFeedbackItemUrlQuery = () => {
  const router = useRouter();

  const handleUrlQuery = useCallback(
    (type: 'page' | 'filter' | 'limit', payload: any) => {
      const replace = (url: UrlObject) =>
        router.replace(url, undefined, { shallow: true });

      const { query, pathname } = router;

      switch (type) {
        case 'page':
          replace({ query: { ...query, [type]: payload }, pathname });
          break;
        case 'limit':
          replace({ query: { ...query, [type]: payload, page: 1 }, pathname });
          break;
        case 'filter':
          const { limit, feedbackId } = query;
          replace({
            query: removeNull({ feedbackId, ...payload, limit, page: 1 }),
            pathname,
          });
          break;
        default:
          break;
      }
    },
    [router],
  );
  return { handleUrlQuery };
};

export default useFeedbackItemUrlQuery;
