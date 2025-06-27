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

import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Menu, MenuItem, toast } from '@ufb/react';

import { SettingTemplate, useOAIQuery } from '@/shared';
import {
  AIFieldTemplateForm,
  AIFieldTemplateSetting,
  AISettingForm,
  AISettingFormButton,
  AITemplateFormButton,
  AIUsageForm,
  AIUsageFormButton,
} from '@/features/update-ai-setting';

type SubMenuType =
  | 'setting'
  | 'usage'
  | 'field-template'
  | 'field-template-form';
const GenerativeAiSetting = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const subMenu = (router.query.subMenu ?? 'setting') as SubMenuType;

  const setSubMenu = async (subMenu: SubMenuType, templateId?: number) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, subMenu, templateId },
    });
  };
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const isSettingsEmpty = !data || data.apiKey === '';

  return (
    <>
      <SettingTemplate
        title={
          subMenu === 'field-template-form' ? 'Template Details' : (
            t('v2.project-setting-menu.generative-ai-setting')
          )
        }
        action={
          <>
            {subMenu === 'setting' && <AISettingFormButton />}
            {subMenu === 'usage' && <AIUsageFormButton />}
            {subMenu === 'field-template-form' && (
              <AITemplateFormButton projectId={projectId} />
            )}
          </>
        }
        onClickBack={
          subMenu === 'field-template-form' ?
            () => setSubMenu('field-template')
          : undefined
        }
      >
        {subMenu !== 'field-template-form' && (
          <Menu
            type="single"
            orientation="horizontal"
            value={subMenu}
            onValueChange={async (v) => {
              if (isSettingsEmpty && v !== 'setting') {
                toast.warning('AI Settings 저장 후에 이용할 수 있습니다.');
                return;
              }
              await setSubMenu(v as SubMenuType);
            }}
          >
            <MenuItem className="w-fit shrink-0" value="setting">
              AI Setting
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="usage">
              AI Usage
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="field-template">
              AI Field Template
            </MenuItem>
          </Menu>
        )}
        {subMenu === 'setting' && <AISettingForm projectId={projectId} />}
        {subMenu === 'usage' && <AIUsageForm projectId={projectId} />}
        {subMenu === 'field-template' && (
          <AIFieldTemplateSetting
            projectId={projectId}
            onClick={(id) => setSubMenu('field-template-form', id)}
          />
        )}
        {subMenu === 'field-template-form' && (
          <AIFieldTemplateForm projectId={projectId} />
        )}
      </SettingTemplate>
    </>
  );
};

export default GenerativeAiSetting;
