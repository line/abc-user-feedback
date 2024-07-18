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
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { DATE_FORMAT, isDateQuery, removeEmptyValueInObject } from '@/shared';

const useQueryParamsState = (
  defaultNextQuery: Record<string, string>,
  defaultQuery?: Record<string, string>,
  validate?: (input: Record<string, unknown>) => boolean,
) => {
  const router = useRouter();

  const query: Record<string, unknown> = useMemo(() => {
    const newQuery = Object.entries(router.query).reduce(
      (acc, [key, value]) =>
        key in defaultNextQuery ? acc : { ...acc, [key]: value },
      {},
    );

    const result = { ...defaultQuery, ...removeEmptyValueInObject(newQuery) };

    if (validate && !validate(result)) {
      void router.replace({
        pathname: router.pathname,
        query: defaultNextQuery,
      });

      return defaultQuery ?? {};
    }
    return result;
  }, [router.query]);

  const setQuery = useCallback(
    (input: Record<string, unknown>) => {
      const newQuery: Record<string, string> = Object.entries(
        removeEmptyValueInObject(input),
      ).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && isDateQuery(value)) {
          value = `${dayjs(value.gte).format(DATE_FORMAT)}~${dayjs(
            value.lt,
          ).format(DATE_FORMAT)}`;
        }

        return { ...acc, [key]: value };
      }, {});
      void router.push(
        {
          pathname: router.pathname,
          query: { ...defaultNextQuery, ...defaultQuery, ...newQuery },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, defaultQuery],
  );
  return { query, setQuery };
};

export default useQueryParamsState;
