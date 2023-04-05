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
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading } from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export interface TitleTemplateProps extends React.PropsWithChildren {
  title?: string | null;
  cardProps?: BoxProps;
  showBackBtn?: boolean;
}

const TitleTemplate: React.FC<TitleTemplateProps> = (props) => {
  const { title, children, showBackBtn = false } = props;
  const router = useRouter();

  return (
    <>
      {title && (
        <Flex sx={{ alignItems: 'center', mb: 6 }}>
          {showBackBtn && (
            <ArrowBackIcon
              sx={{ cursor: 'pointer', mr: 2, boxSize: 6 }}
              onClick={() => router.back()}
            />
          )}
          <Heading>{title}</Heading>
        </Flex>
      )}
      <Box>{children}</Box>
    </>
  );
};

export default TitleTemplate;
