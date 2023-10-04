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
import { Header, flexRender } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import DownloadButton from '@/containers/tables/FeedbackTable/DownloadButton';

interface IProps {
  header?: Header<any, unknown>;
  headerLength: number;
  onClickDelete: () => void;
  onClickCancle: () => void;
  count: number;
  download?: {
    projectId: number;
    channelId: number;
    ids: number[];
  };
  disabled?: boolean;
}

const CheckedTableHead: React.FC<IProps> = (props) => {
  const {
    header,
    headerLength,
    onClickCancle,
    onClickDelete,
    count,
    disabled,
    download,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <th style={{ width: header?.getSize() }}>
        {header &&
          flexRender(header?.column.columnDef.header, header.getContext())}
      </th>
      <th colSpan={headerLength - 1}>
        <div className="flex gap-5 items-center">
          <span className="font-12-bold text-blue-primary">
            {t('text.select-count', { count })}
          </span>
          <button
            className="btn btn-tertiary btn-sm min-w-0"
            onClick={onClickCancle}
          >
            {t('button.select-cancel')}
          </button>
          <div className="border-r-fill-secondary border-r-[1px] h-4" />
          {download && (
            <>
              <DownloadButton
                query={{ ids: download.ids }}
                count={download.ids.length}
                isHead
              />
              <div className="border-r-fill-secondary border-r-[1px] h-4" />
            </>
          )}
          <button
            className="btn btn-tertiary btn-sm min-w-0 text-red-primary"
            onClick={onClickDelete}
            disabled={disabled}
          >
            {t('button.delete')}
          </button>
        </div>
      </th>
    </>
  );
};

export default CheckedTableHead;
