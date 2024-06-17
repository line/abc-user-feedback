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
import type { CreateProjectStepKey } from './create-project-type';
import {
  CREATE_PROJEC_STEP_KEY_LIST,
  FIRST_CREATE_PROJECT_STEP,
  LAST_CREATE_PROJECT_STEP,
} from './create-project-type';

import { create, createZustandFactory } from '@/libs/zustand';

type State = {
  editingStep: number;
  currentStep: number;
};

type Action = {
  prevStep: () => void;
  nextStep: () => void;
  jumpTo: (step: number) => void;
  getCurrentStepKey: () => CreateProjectStepKey;
};

export const useCreateProjectStore = create<State, Action>((set, get) => ({
  state: {
    editingStep: 0,
    currentStep: 0,
  },
  getCurrentStepKey() {
    const { currentStep } = get().state;
    return (
      CREATE_PROJEC_STEP_KEY_LIST[currentStep] ?? CREATE_PROJEC_STEP_KEY_LIST[0]
    );
  },
  jumpTo(step) {
    set(({ state }) => ({ state: { ...state, currentStep: step } }));
  },
  nextStep() {
    set(({ state }) => ({
      state: {
        ...state,
        currentStep: Math.min(state.currentStep + 1, LAST_CREATE_PROJECT_STEP),
        editingStep: Math.max(state.editingStep, state.currentStep + 1),
      },
    }));
  },
  prevStep() {
    set(({ state }) => ({
      state: {
        ...state,
        currentStep: Math.max(state.currentStep - 1, FIRST_CREATE_PROJECT_STEP),
      },
    }));
  },
}));

export const [useCreateProjectState, useCreateProjectActions] =
  createZustandFactory(useCreateProjectStore);
