import { expect, test } from "@playwright/test";

export default () => {
  test.describe("create-channel suite", () => {
    test("creating a channel succeeds", async ({ page }) => {
      await page.goto("http://localhost:3000");
      await page.waitForTimeout(1000);

      await page.getByRole("radio", { name: "Settings" }).click();
      await page.waitForTimeout(1000);
      await page.getByRole("radio", { name: "Create Channel" }).click();
      await page.waitForTimeout(1000);
      await page.locator('input[name="name"]').click();
      await page.locator('input[name="name"]').fill("TestChannel");
      await page.getByRole("button", { name: "Next" }).click();
      await page.getByRole("button", { name: "Complete" }).click();
      await page.getByRole("button", { name: "Start" }).click();
      await page.waitForTimeout(1500);
      await expect(
        page.getByRole("tab", { name: "TestChannel" }).first()
      ).toContainText("TestChannel");
    });
  });
};
