import { expect, test } from "@playwright/test";

export default () => {
  test.afterEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(1500);

    await page.getByRole("radio", { name: "Settings" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Delete Project" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("TestProject")).toHaveCount(0);
  });

  test("creating a project succeeds", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.locator("input[name='name']").click();
    await page.locator("input[name='name']").fill("TestProject");

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Complete" }).click();
    await page.waitForTimeout(1500);

    await expect(page.getByText("Project Creation Complete")).toBeVisible();
    await expect(page.locator("input[name='name']")).toHaveValue("TestProject");
    await page.getByRole("button", { name: "Later" }).click();
  });
};
