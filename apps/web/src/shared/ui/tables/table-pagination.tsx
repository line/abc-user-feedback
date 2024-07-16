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
import { useTranslation } from 'next-i18next';

import { Icon } from '@ufb/ui';

interface IProps extends React.PropsWithChildren {
  limit?: number;
  setLimit?: (limit: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  disabledPrevPage: boolean;
  disabledNextPage: boolean;
  short?: boolean;
}

const TablePagination: React.FC<IProps> = (props) => {
  const {
    limit,
    disabledNextPage,
    disabledPrevPage,
    nextPage,
    prevPage,
    setLimit,
    short = false,
  } = props;

  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      {!short && (
        <>
          <p className="whitespace-nowrap">{t('text.per-page')}</p>
          <select
            className="text-primary bg-primary"
            value={limit}
            onChange={(e) =>
              setLimit && setLimit(parseInt(e.currentTarget.value))
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </>
      )}
      <button
        className="icon-btn icon-btn-xs icon-btn-tertiary"
        onClick={prevPage}
        disabled={disabledPrevPage}
      >
        <Icon name="ChevronLeft" />
      </button>
      <button
        className="icon-btn icon-btn-xs icon-btn-tertiary"
        onClick={nextPage}
        disabled={disabledNextPage}
      >
        <Icon name="ChevronRight" />
      </button>
    </div>
  );
};

export default TablePagination;
