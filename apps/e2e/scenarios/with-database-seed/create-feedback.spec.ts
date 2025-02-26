import { expect, test } from "@playwright/test";
import axios from "axios";

export default () => {
  test.describe("create-feedback suite", () => {
    test.afterEach(async ({ page }) => {
      await page
        .getByRole("cell", { name: "1", exact: true })
        .locator("div")
        .click();
      await page.getByRole("button", { name: "Delete" }).click();
      await page.waitForTimeout(1000);
      await page.getByRole("button", { name: "Delete" }).click();
      await page.waitForTimeout(1000);

      await expect(page.locator("tbody")).not.toContainText("test text");
    });

    test("creating a feedback succeeds", async ({ page }) => {
      await page.goto("http://localhost:3000");
      await page.waitForTimeout(1000);

      await page.getByRole("radio", { name: "Feedback" }).click();
      await page.waitForTimeout(1000);
      await page.waitForURL(/.*channelId.*/, { timeout: 1000 });

      const url = new URL(page.url());
      const pathname = url.pathname;
      const segments = pathname.split("/");
      const projectId = segments[3];
      const params = new URLSearchParams(url.search);
      const channelId = params.get("channelId");

      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/channels/${channelId}/feedbacks`,
        { SeededTestTextField: "test text" },
        { headers: { "x-api-key": "MASTER_API_KEY" } }
      );

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`
      );
      await page.waitForTimeout(1000);

      await expect(page.locator("tbody")).toContainText("test text");
    });
  });
};
