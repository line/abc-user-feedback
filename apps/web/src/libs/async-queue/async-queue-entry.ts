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
import type { AsyncQueue } from '.';

/**
 * @internal
 */
export class AsyncQueueEntry {
  public readonly promise: Promise<void>;
  private resolve!: () => void;
  private reject!: (error: Error) => void;
  private readonly queue: AsyncQueue;
  private signal: PolyFillAbortSignal | null = null;
  private signalListener: (() => void) | null = null;

  public constructor(queue: AsyncQueue) {
    this.queue = queue;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public setSignal(signal: AbortSignal) {
    if (signal.aborted) return this;

    this.signal = signal as PolyFillAbortSignal;
    this.signalListener = () => {
      const index = this.queue['promises'].indexOf(this);
      if (index !== -1) this.queue['promises'].splice(index, 1);

      this.reject(new Error('Request aborted manually'));
    };
    this.signal.addEventListener('abort', this.signalListener);
    return this;
  }

  public use() {
    this.dispose();
    this.resolve();
    return this;
  }

  public abort() {
    this.dispose();
    this.reject(new Error('Request aborted manually'));
    return this;
  }

  private dispose() {
    if (this.signal) {
      this.signal.removeEventListener('abort', this.signalListener!);
      this.signal = null;
      this.signalListener = null;
    }
  }
}

interface PolyFillAbortSignal {
  readonly aborted: boolean;
  addEventListener(type: 'abort', listener: () => void): void;
  removeEventListener(type: 'abort', listener: () => void): void;
}
