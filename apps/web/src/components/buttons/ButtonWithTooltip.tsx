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

import { Tooltip, TooltipContent, TooltipTrigger } from '@ufb/ui';

import type { ColorType } from '@/types/color.type';

interface IProps extends React.PropsWithChildren {
  open?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  tooltipColor?: ColorType;
  tooltipContent?: React.ReactNode;
}

const CreateProjectButton: React.FC<IProps> = (props) => {
  const { open, onClick, disabled, children, tooltipColor, tooltipContent } =
    props;

  return (
    <Tooltip open={open} placement="bottom">
      <TooltipTrigger asChild>
        <button
          className="btn btn-lg btn-primary w-[200px] gap-2"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent color={tooltipColor}>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
};

export default CreateProjectButton;
