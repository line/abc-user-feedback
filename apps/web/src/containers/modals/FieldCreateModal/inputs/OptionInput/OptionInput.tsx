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
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';

interface IProps extends React.PropsWithChildren {
  optionName: string;
  setOptionName: React.Dispatch<React.SetStateAction<string>>;
  addOption: () => void;
  options: { id?: string; name: string }[];
  removeOption: (index: number) => void;
  modifyLabel: (index: number, name: string) => void;
}

const OptionInput: React.FC<IProps> = (props) => {
  const {
    optionName,
    setOptionName,
    addOption,
    options,
    removeOption,
    modifyLabel,
  } = props;
  const { t } = useTranslation();
  const ref = useRef(null);

  const [modifyingIndex, setModifyingIndex] = useState(-1);
  const [modifyingLabel, setModifyingLabel] = useState('');

  const resetModifying = () => {
    setModifyingIndex(-1);
    setModifyingLabel('');
  };

  const onClickLabel = (index: number, label: string) => {
    setModifyingLabel(label);
    setModifyingIndex(index);
  };

  const onClickSave = () => {
    modifyLabel(modifyingIndex, modifyingLabel);
    resetModifying();
  };

  useOutsideClick({ ref, handler: resetModifying });

  return (
    <FormControl>
      <FormLabel>{t('fieldOption')}</FormLabel>
      <Flex gap={4} mb={4}>
        <Box flex={1}>
          <Input
            value={optionName}
            onChange={(e) =>
              e.currentTarget.value.length <= 20 &&
              setOptionName(e.currentTarget.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOption();
              }
            }}
          />
          <FormHelperText>{optionName.length}/20</FormHelperText>
        </Box>
        <Button onClick={addOption}>{t('button.add')}</Button>
      </Flex>
      <Flex
        mb={2}
        borderWidth={1}
        borderRadius="lg"
        p={2}
        gap={4}
        flexWrap="wrap"
      >
        {options.map(({ id, name }, index) => (
          <Flex
            key={index}
            bg="gray.300"
            borderRadius="lg"
            py={1}
            px={3}
            alignItems="center"
          >
            {modifyingIndex === index ? (
              <Box ref={ref}>
                <Input
                  value={modifyingLabel}
                  onChange={(e) => setModifyingLabel(e.target.value)}
                />
                <br />
                <ButtonGroup mt={2}>
                  <Button size="sm" onClick={onClickSave}>
                    {t('button.save')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetModifying}>
                    {t('button.cancel')}
                  </Button>
                </ButtonGroup>
              </Box>
            ) : (
              <Text cursor="pointer" onClick={() => onClickLabel(index, name)}>
                {name}
              </Text>
            )}
            {!id && (
              <IconButton
                aria-label="delete item"
                variant="ghost"
                icon={<CloseIcon />}
                onClick={() => removeOption(index)}
                size="xs"
                ml={2}
              />
            )}
          </Flex>
        ))}
      </Flex>
    </FormControl>
  );
};

export default OptionInput;
