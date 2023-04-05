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
import { AsyncQueueEntry } from './async-queue-entry';

/**
 * The AsyncQueue class used to sequentialize burst requests
 */
export class AsyncQueue {
  /**
   * The amount of entries in the queue, including the head.
   * @seealso {@link queued} for the queued count.
   */
  public get remaining(): number {
    return this.promises.length;
  }

  /**
   * The amount of queued entries.
   * @seealso {@link remaining} for the count with the head.
   */
  public get queued(): number {
    return this.remaining === 0 ? 0 : this.remaining - 1;
  }

  /**
   * The promises array
   */
  private promises: AsyncQueueEntry[] = [];

  /**
   * Waits for last promise and queues a new one
   * @example
   * ```typescript
   * const queue = new AsyncQueue();
   * async function request(url, options) {
   *     await queue.wait({ signal: options.signal });
   *     try {
   *         const result = await fetch(url, options);
   *         // Do some operations with 'result'
   *     } finally {
   *         // Remove first entry from the queue and resolve for the next entry
   *         queue.shift();
   *     }
   * }
   *
   * request(someUrl1, someOptions1); // Will call fetch() immediately
   * request(someUrl2, someOptions2); // Will call fetch() after the first finished
   * request(someUrl3, someOptions3); // Will call fetch() after the second finished
   * ```
   */
  public wait(options?: Readonly<AsyncQueueWaitOptions>): Promise<void> {
    const entry = new AsyncQueueEntry(this);

    if (this.promises.length === 0) {
      this.promises.push(entry);
      return Promise.resolve();
    }

    this.promises.push(entry);
    if (options?.signal) entry.setSignal(options.signal);
    return entry.promise;
  }

  /**
   * Unlocks the head lock and transfers the next lock (if any) to the head.
   */
  public shift(): void {
    if (this.promises.length === 0) return;
    if (this.promises.length === 1) {
      // Remove the head entry.
      this.promises.shift();
      return;
    }

    // Remove the head entry, making the 2nd entry the new one.
    // Then use the head entry, which will unlock the promise.
    this.promises.shift();
    this.promises[0].use();
  }

  /**
   * Aborts all the pending promises.
   * @note To avoid race conditions, this does **not** unlock the head lock.
   */
  public abortAll(): void {
    // If there are no queued entries, skip early.
    if (this.queued === 0) return;

    // Abort all the entries except the head, that is why the loop starts at
    // 1 and not at 0.
    for (let i = 1; i < this.promises.length; ++i) {
      this.promises[i].abort();
    }

    this.promises.length = 1;
  }
}

export interface AsyncQueueWaitOptions {
  signal?: AbortSignal | undefined | null;
}
