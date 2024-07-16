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
import type { Dispatch, SetStateAction } from 'react';
import React, { useRef } from 'react';
import type { PopperPlacementType } from '@mui/base';
import { Popper as MUIPopper } from '@mui/base';
import { useClickAway } from 'react-use';

interface IProps {
  buttonChildren: React.ReactElement;
  children?: React.ReactNode;
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  placement?: PopperPlacementType;
  offset?: number;
}

const Popper: React.FC<IProps> = (props) => {
  const {
    buttonChildren,
    children,
    setOpen,
    open,
    placement,
    offset = 6,
  } = props;

  const buttonRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => setOpen && setOpen(false));

  return (
    <>
      {React.cloneElement(buttonChildren, { ref: buttonRef })}
      <MUIPopper
        open={open}
        anchorEl={buttonRef.current}
        popperOptions={{
          placement: placement ?? 'bottom-end',
          modifiers: [{ name: 'offset', options: { offset: [0, offset] } }],
        }}
        className="bg-primary z-20 rounded border"
        ref={containerRef}
      >
        {children}
      </MUIPopper>
    </>
  );
};

export default Popper;
