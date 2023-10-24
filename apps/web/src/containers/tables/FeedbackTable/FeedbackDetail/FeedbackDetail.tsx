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
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import { useFeedbackSearch } from '@/hooks';

interface IProps {
  id: number;
  projectId: number;
  channelId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDetail: React.FC<IProps> = (props) => {
  const { channelId, id, projectId, onOpenChange, open } = props;
  const { data } = useFeedbackSearch(projectId, channelId, {
    query: { ids: [id] },
  });

  const { refs, context } = useFloating({
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <FloatingFocusManager context={context} modal>
      <FloatingOverlay
        lockScroll={true}
        className="bg-dim"
        style={{ display: 'grid', placeItems: 'center', zIndex: 20 }}
      >
        <div
          className="bg-primary fixed right-0 top-0 h-screen w-1/3 min-w-[200px]"
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <div className="p-2">
            {data ? JSON.stringify(data.items?.[0]) : null}
          </div>
        </div>
      </FloatingOverlay>
    </FloatingFocusManager>
  );
};

export default FeedbackDetail;
