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

import { DATE_FORMAT } from '@/constants/dayjs-format';
import { removeEmptyValueInObject } from '@/utils/remove-empty-value-in-object';

const useQueryParamsState = (
  defaultNextQuery: Record<string, any>,
  defaultQuery?: Record<string, string>,
  validate?: (input: Record<string, string>) => boolean,
) => {
  const router = useRouter();

  const query = useMemo(() => {
    const newQuery = Object.entries(router.query).reduce(
      (acc, [key, value]) => {
        if (key in defaultNextQuery) return acc;
        return { ...acc, [key]: value };
      },
      {} as Record<string, any>,
    );
    const result = {
      ...defaultQuery,
      ...removeEmptyValueInObject(newQuery),
    };
    if (validate && !validate(result)) {
      router.replace({ pathname: router.pathname, query: defaultNextQuery });
      return defaultQuery ?? {};
    }
    return result;
  }, [router.query]);

  const setQuery = useCallback(
    (input: Record<string, any>) => {
      const newQuery: Record<string, string> = Object.entries(
        removeEmptyValueInObject(input),
      ).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'object' && isDate(value)) {
            value = `${dayjs(value.gte).format(DATE_FORMAT)}~${dayjs(
              value.lt,
            ).format(DATE_FORMAT)}`;
          }
          return { ...acc, [key]: value };
        },
        {} as Record<string, any>,
      );
      router.push(
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

const isDate = (value: any) => {
  return 'gte' in value && 'lt' in value;
};
