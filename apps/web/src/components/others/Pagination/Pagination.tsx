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
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import ReactSelect from 'react-select';

interface IProps extends React.PropsWithChildren {
  limit?: {
    onChangeLimit: (limit: number) => void;
    options: number[];
  };
  meta: {
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
  onChangePage: (page: number) => void;
}

const Pagination: React.FC<IProps> = (props) => {
  const { onChangePage, meta, limit } = props;
  const { currentPage, itemsPerPage, totalPages } = meta;

  const { t } = useTranslation();

  const totalPageOptions = useMemo(
    () =>
      Array.from({ length: totalPages })
        .map((_, idx) => idx + 1)
        .map((page) => ({ label: page, value: page })),
    [totalPages],
  );

  return (
    <HStack spacing={4} mt={8} justify="center" align="center">
      <Button
        size="sm"
        colorScheme="gray"
        disabled={totalPages === 0 || currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <ChevronLeftIcon boxSize={5} /> {t('button.prev')}
      </Button>
      <Flex alignItems="center">
        <ReactSelect
          instanceId="pagination"
          isDisabled={totalPages === 0}
          value={
            totalPages === 0
              ? { label: 0, value: 0 }
              : { label: currentPage, value: currentPage }
          }
          options={totalPageOptions}
          onChange={(option) => option && onChangePage(option.value)}
          menuPlacement="top"
          styles={{ indicatorSeparator: () => ({}) }}
        />
        <Text ml={2}>of {totalPages}</Text>
      </Flex>
      <Button
        size="sm"
        colorScheme="gray"
        disabled={totalPages === 0 || currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
      >
        {t('button.next')} <ChevronRightIcon boxSize={5} />
      </Button>
      {limit && (
        <Flex alignItems="center">
          <ReactSelect
            instanceId="limit"
            options={limit.options.map((v) => ({ label: v, value: v }))}
            onChange={(option) => option && limit.onChangeLimit(option.value)}
            value={{ label: itemsPerPage, value: itemsPerPage }}
            menuPlacement="top"
          />
          <Text ml={2}>{t('text.perPage')}</Text>
        </Flex>
      )}
    </HStack>
  );
};

export default Pagination;
