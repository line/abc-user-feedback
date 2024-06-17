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
import type {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
  UseBoundStore,
} from 'zustand';
import { create as createZustand } from 'zustand';

type ZustandState<State, Action> = State & Action;

type Create = {
  <State, Action, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<ZustandState<State, Action>, [], Mos>,
  ): UseBoundStore<Mutate<StoreApi<ZustandState<State, Action>>, Mos>>;
  <State, Action>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<ZustandState<State, Action>, [], Mos>,
  ) => UseBoundStore<Mutate<StoreApi<ZustandState<State, Action>>, Mos>>;
};

export const create = (<State, Action>(
  initializer?: StateCreator<ZustandState<State, Action>> | undefined,
) =>
  initializer ?
    createZustand<ZustandState<State, Action>>(initializer)
  : createZustand<ZustandState<State, Action>>()) as Create;

export const createZustandFactory = <State, Action>(
  input: UseBoundStore<StoreApi<ZustandState<State, Action>>>,
): [() => State, () => Action] => [
  () => input(({ state }) => state),
  () => input(({ state: _, ...actions }) => actions) as Action,
];
