/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { useRouter } from 'next/router';

import {
  Caption,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  Tag,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

interface Props {
  aiFieldTemplateId?: number | null;
}

const AiFieldOptionPopover = ({ aiFieldTemplateId }: Props) => {
  const router = useRouter();
  const projectId = +(router.query.projectId as string);
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/fieldTemplates',
    variables: { projectId },
  });

  const aiFieldTemplate = data?.find((v) => v.id === aiFieldTemplateId);

  if (!aiFieldTemplate) {
    return <Caption variant="error">Template is not found</Caption>;
  }
  return (
    <Dropdown>
      <DropdownTrigger asChild data-state="close">
        <Tag onClick={(e) => e.stopPropagation()}>
          Template Option
          <Icon name="RiInformation2Line" />
        </Tag>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>{aiFieldTemplate.title}</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default AiFieldOptionPopover;
