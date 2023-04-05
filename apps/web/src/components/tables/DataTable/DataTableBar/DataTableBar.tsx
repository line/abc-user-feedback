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
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface IDataTableBarProps {
  leftButtons?: ButtonProps[];
  searchInput?: {
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
  };
  rightButtons?: ButtonProps[];
  checkListLength?: number;
  count?: number;
}

const DataTableBar: React.FC<IDataTableBarProps> = (props) => {
  const {
    rightButtons = [],
    searchInput,
    checkListLength,
    count,
    leftButtons = [],
  } = props;
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" justifyContent="space-between" mb={4}>
      <Box>
        <Text fontWeight="bold">
          {`${t('text.selection')} `}
          <Text color="primary" as="span">
            {checkListLength}
          </Text>
          /{count ?? 0}
        </Text>{' '}
      </Box>
      <Flex gap={2}>
        {leftButtons.map((props, idx) => (
          <Button key={idx} {...props} colorScheme="gray" />
        ))}
        <InputGroup w="300px">
          <InputRightElement pointerEvents="none">
            <SearchIcon />
          </InputRightElement>
          <Input {...searchInput} />
        </InputGroup>
        {rightButtons.map((props, idx) => (
          <Button key={idx} {...props} />
        ))}
      </Flex>
    </Flex>
  );
};

export default DataTableBar;
