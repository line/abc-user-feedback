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
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import { useMemo } from 'react';

import { RESERVED_FIELD_NAMES } from '@/constants/reserved-field-name';
import { useOAIQuery } from '@/hooks';

const { publicRuntimeConfig } = getConfig();

interface IProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}

const SnippetModal: React.FC<IProps> = (props) => {
  const { isOpen, onClose, channelId } = props;
  const { t } = useTranslation();

  const { data: fieldData } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });

  const snippetBody = useMemo(() => {
    if (!fieldData) return;
    const body: Record<string, any> = {};
    for (const field of fieldData.filter(
      (v) => !RESERVED_FIELD_NAMES.includes(v.name),
    )) {
      if (field.isAdmin || field.isDisabled) continue;
      const key = `'${field.name}'`;
      switch (field.type) {
        case 'boolean':
        case 'number':
        case 'date':
          body[key] = field.type;
          break;
        case 'text':
          body[key] = 'string';
          break;
        case 'select':
          body[key] = field.options.map((v) => `'${v.name}'`).join(' or ');
          break;
        default:
          break;
      }
    }
    return body;
  }, [fieldData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="1080px">
        <ModalHeader>{t('feedbackCodeSnippet')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <pre>
            {`curl --request POST ${
              process.env.NEXT_PUBLIC_API_BASE_URL
            }/api/channels/${channelId}/feedbacks\n--header 'Content-Type: application/json' \n--data-raw '${
              snippetBody
                ? JSON.stringify(snippetBody, null, 4)
                    .replace(/\"/g, '')
                    .replace(/\'/g, '"')
                : ''
            }'`}
          </pre>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SnippetModal;
