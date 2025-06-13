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
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { Menu, MenuItem } from '@ufb/react';

import { SettingTemplate } from '@/shared';
import {
  AIFieldTemplateForm,
  AIFieldTemplateSetting,
  AISettingForm,
  AISettingFormButton,
  AITemplateFormButton,
  AIUsageForm,
  AIUsageFormButton,
} from '@/features/update-ai-setting';

const SUB_MENU_ITEMS = [
  { value: 'setting', label: 'AI Setting' },
  { value: 'usage', label: 'AI Usage' },
  { value: 'field-template', label: 'AI Field Template' },
  { value: 'field-template-form', label: 'AI Issue Recommend' },
  { value: 'issue-recommend', label: 'AI Issue Recommend' },
] as const;

const GenerativeAiSetting = ({ projectId }: { projectId: number }) => {
  const [subMenu, setSubMenu] = useQueryState(
    'sub-menu',
    parseAsStringLiteral(SUB_MENU_ITEMS.map((item) => item.value)).withDefault(
      'setting',
    ),
  );

  return (
    <>
      <SettingTemplate
        title={
          subMenu === 'field-template-form' ? 'Template Details' : (
            '생성형 AI 연동'
          )
        }
        action={
          <>
            {subMenu === 'setting' && <AISettingFormButton />}
            {subMenu === 'usage' && <AIUsageFormButton />}
            {subMenu === 'field-template-form' && <AITemplateFormButton />}
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
            onValueChange={(v) => setSubMenu(v as typeof subMenu)}
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
            onClick={() => setSubMenu('field-template-form')}
          />
        )}
        {subMenu === 'field-template-form' && (
          <AIFieldTemplateForm projectId={projectId} />
        )}
        {subMenu === 'issue-recommend' && <AIIssueRecommendForm />}
      </SettingTemplate>
    </>
  );
};

const AIIssueRecommendForm = () => {
  return <>AIFieldTemplateForm</>;
};

export default GenerativeAiSetting;
