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

import { createContext, useCallback, useContext, useState } from 'react';

import type { PlaygroundInputItem } from '../playground-input-item.schema';

export interface AIPlaygroundContextValue {
  inputItems: PlaygroundInputItem[];
  createInputItem: (item: PlaygroundInputItem) => void;
  updateInputItem: (index: number, item: PlaygroundInputItem) => void;
  deleteInputItem: (index: number) => void;
  addNewEditingItem: () => void;
}

export const AIPlaygroundContext = createContext<AIPlaygroundContextValue>({
  inputItems: [],
  createInputItem: () => {
    // Empty function for default context
  },
  updateInputItem: () => {
    // Empty function for default context
  },
  deleteInputItem: () => {
    // Empty function for default context
  },
  addNewEditingItem: () => {
    // Empty function for default context
  },
});

export const AIPlaygroundContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [inputItems, setInputItems] = useState<PlaygroundInputItem[]>([]);

  const createInputItem = useCallback((item: PlaygroundInputItem) => {
    setInputItems((prev) => [...prev, item]);
  }, []);

  const updateInputItem = useCallback(
    (index: number, item: PlaygroundInputItem) => {
      setInputItems((prev) =>
        prev.map((prevItem, i) => (i === index ? item : prevItem)),
      );
    },
    [],
  );

  const deleteInputItem = useCallback((index: number) => {
    setInputItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addNewEditingItem = useCallback(() => {
    setInputItems((prev) => [
      { name: '', description: '', value: '', isEditing: true },
      ...prev,
    ]);
  }, []);

  return (
    <AIPlaygroundContext.Provider
      value={{
        createInputItem,
        deleteInputItem,
        inputItems,
        updateInputItem,
        addNewEditingItem,
      }}
    >
      {children}
    </AIPlaygroundContext.Provider>
  );
};

export const useAIPlayground = () => {
  return useContext(AIPlaygroundContext);
};
