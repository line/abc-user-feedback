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
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

const boxCN = 'px-3 relative first:pl-0 last:pr-0 ';

interface IBoxProps extends React.PropsWithChildren {
  show: boolean;
  last?: boolean;
}

const SettingMenuBox: React.FC<IBoxProps> = (props) => {
  const { children, show, last = false } = props;

  const flexCN = last ? 'flex-0' : 'flex-1';
  const transitionFlexCN = last ? 'flex-[2]' : 'flex-0';

  return (
    <Transition
      show={show}
      enter="transition-all duration-500"
      enterFrom="flex-[0] px-0 opacity-0 overflow-hidden"
      enterTo={['px-3 opacity-100 overflow-hidden', transitionFlexCN].join(' ')}
      leave="transition-all duration-500"
      leaveFrom={['px-3 opacity-100 overflow-hidden', transitionFlexCN].join(
        ' ',
      )}
      leaveTo="flex-[0] px-0 opacity-0 overflow-hidden"
    >
      <div className={clsx(boxCN, flexCN, { 'overflow-hidden': show && last })}>
        {children}
      </div>
    </Transition>
  );
};

export default SettingMenuBox;
