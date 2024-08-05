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
import type { NextPage } from 'next';

import {
  Calendar,
  Menu,
  MenuItem,
  NavBar,
  NavBarButton,
  NavBarDivider,
  NavBarMenu,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

const TestPage: NextPage = () => {
  return (
    <div>
      <NavBar>
        <div className="w-[240px]">
          <Select>
            <SelectTrigger size="small">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent maxHeight="auto" position="popper">
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <NavBarDivider />
        <NavBarMenu
          className="flex-1"
          type="single"
          items={[
            { children: 'Dashboard', value: 'menu-value-1' },
            { children: 'Feedback', value: 'menu-value-2' },
            { children: 'Issue', value: 'menu-value-3' },
            { children: 'Settings', value: 'menu-value-4' },
          ]}
        />
        <div className="flex gap-3">
          <NavBarButton icon="RiBuildingLine" />
          <NavBarButton icon="RiSunLine" />
          <NavBarButton icon="RiTranslate2" />
          <NavBarButton icon="RiUser6Line" />
        </div>
      </NavBar>
      <div className="p-5">
        <div className="h-20 px-6 py-3">
          <h1 className="title-h3">Settings</h1>
        </div>
        <div className="flex h-full gap-8">
          <div className="w-[280px] flex-shrink-0 px-3 py-6">
            <Menu type="single" align="vertical" className="w-full">
              <MenuItem value="Home" iconL="RiInformation2Fill">
                Home
              </MenuItem>
              <MenuItem value="Home" iconL="RiUser2Fill">
                Member 관리
              </MenuItem>
              <MenuItem value="Home" iconL="RiShieldKeyholeFill">
                API Key 관리
              </MenuItem>
              <MenuItem value="Home" iconL="RiSeoFill">
                Issue Tracker 관리
              </MenuItem>
              <MenuItem value="Home" iconL="RiWebhookFill">
                Webhook 연동
              </MenuItem>
            </Menu>
          </div>
          <div className="w-full rounded border border-neutral-400">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
