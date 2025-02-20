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

import { useCallback, useRef, useState } from 'react';
import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  getFirstCollision,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { Issue } from '@/entities/issue';

type Items = Record<UniqueIdentifier, Issue[]>;

interface Props extends React.PropsWithChildren {
  items: Items;
  setItems: React.Dispatch<React.SetStateAction<Items>>;
  setContainers: React.Dispatch<React.SetStateAction<UniqueIdentifier[]>>;
  updateStatus: (item: Issue, status: string) => void;
}

const IssueKanbanDndContext = (props: Props) => {
  const { children, items, setItems, setContainers, updateStatus } = props;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items,
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0 ?
          pointerIntersections // If there are droppables intersecting with the pointer, return those
        : rectIntersection(args);

      let overId = getFirstCollision(intersections, 'id');

      if (overId !== null) {
        if (overId in items) {
          const containerItems = items[overId];

          if (!containerItems) throw new Error("Container items can't be null");

          if (containerItems.length > 0) {
            const test = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.some((item) => item.id === container.id),
              ),
            });
            overId = test[0]?.id ?? null;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId ?? 'INIT' }];
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items],
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) return id;

    return Object.keys(items).find((key) =>
      items[key]?.some((v) => v.id === id),
    );
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
    setClonedItems(items);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer] ?? [];
        const overItems = items[overContainer] ?? [];

        const overIndex = overItems.findIndex((v) => v.id === overId);
        const activeIndex = activeItems.findIndex((v) => v.id === active.id);
        const item = activeItems[activeIndex];
        if (!item) return items;

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...items,
          [activeContainer]: activeItems.filter(
            (item) => item.id !== active.id,
          ),
          [overContainer]: [
            ...overItems.slice(0, newIndex),
            item,
            ...overItems.slice(newIndex, overItems.length),
          ],
        };
      });
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);
        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeItems = items[activeContainer] ?? [];
      const overItems = items[overContainer] ?? [];

      const activeIndex = activeItems.findIndex((v) => v.id === active.id);

      const overIndex = overItems.findIndex((v) => v.id === overId);
      const item = activeItems[activeIndex];
      if (item) {
        updateStatus(item, overContainer as string);
      }
      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(overItems, activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
    </DndContext>
  );
};

export default IssueKanbanDndContext;
