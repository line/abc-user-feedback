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
  Box,
  BoxProps,
  Card as CCard,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  SystemStyleObject,
} from '@chakra-ui/react';

interface IProps extends React.PropsWithChildren, Omit<BoxProps, 'title'> {
  title?: string | null;
  actionChildren?: React.ReactNode;
}

const Card: React.FC<IProps> = ({
  children,
  title,
  actionChildren,
  ...props
}) => {
  return (
    <CCard bg="white" {...props}>
      {title && (
        <CardHeader borderBottomWidth="1px" bg="rgba(0,0,0,0.02)">
          <HStack justify="space-between" align="center">
            <Heading size="sm">{title}</Heading>
            <Box>{actionChildren}</Box>
          </HStack>
        </CardHeader>
      )}
      <CardBody p={6}>{children}</CardBody>
    </CCard>
  );
};

const topbarStyle: SystemStyleObject = {
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default Card;
