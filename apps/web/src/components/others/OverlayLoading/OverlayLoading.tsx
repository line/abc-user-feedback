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
  Center,
  CircularProgress,
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

interface IProps extends React.PropsWithChildren {
  isLoading?: boolean;
}

const OverlayLoading: React.FC<IProps> = ({ isLoading = false }) => {
  return (
    <Modal isOpen={isLoading} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow={0} w="auto">
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      </ModalContent>
    </Modal>
  );
};

export default OverlayLoading;
