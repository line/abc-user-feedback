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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Popover, PopoverModalContent } from '@ufb/ui';

import type { Member } from '@/entities/member';
import { MemberTable } from '@/entities/member';
import { useUserSearch } from '@/entities/user';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputMembersStep: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProjectStore();
  const overlay = useOverlay();

  const { t } = useTranslation();
  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const updateMember = (member: Member) => {
    onChangeInput(
      'members',
      input.members.map((m) => (m.id === member.id ? member : m)),
    );
  };

  const deleteMember = (memberId: number) => {
    onChangeInput(
      'members',
      input.members.filter((m) => m.id !== memberId),
    );
  };

  const openInvalidateMemberModal = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover modal open={isOpen} onOpenChange={() => close()}>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-member')}
          submitButton={{
            children: t('button.confirm'),
            onClick: close,
          }}
        />
      </Popover>
    ));
  };

  const validate = () => {
    if (!userData) return false;
    if (
      !input.members.every((member) =>
        userData.items.some((user) => user.id === member.user.id),
      )
    ) {
      openInvalidateMemberModal();
      return false;
    }
    return true;
  };

  return (
    <CreateProjectInputTemplate validate={() => validate()}>
      <MemberTable
        members={input.members}
        roles={input.roles}
        onDeleteMember={deleteMember}
        onUpdateMember={updateMember}
        createButton={<></>}
      />
    </CreateProjectInputTemplate>
  );
};

export default InputMembersStep;
