import { expect, test } from "@playwright/test";

export default () => {
  test.afterEach(async ({ page }) => {
    await page.getByText("TestProject").click();
    await page.getByText("FeedbackIssueSetting").hover();
    await page.getByRole("button", { name: "Settings", exact: true }).click();

    await page.getByText("Delete Project").click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByPlaceholder("Enter Value").click();
    await page.getByPlaceholder("Enter Value").fill("TestProject");
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("TestProject")).toHaveCount(0);
  });

  test("creating a project succeeds", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Create Project" }).click();

    await page.getByPlaceholder("Please enter Project Name.").click();
    await page
      .getByPlaceholder("Please enter Project Name.")
      .fill("TestProject");
    await page.getByPlaceholder("Please enter Project Description.").click();
    await page
      .getByPlaceholder("Please enter Project Description.")
      .fill("Project for test");

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Project Creation Complete")).toBeVisible();
    await expect(page.locator("#Project\\ Name")).toHaveValue("TestProject");
    await expect(page.locator("#Project\\ Description")).toHaveValue(
      "Project for test"
    );
    await page.getByRole("button", { name: "Later" }).click();
    await expect(page.getByText("TestProject")).toBeVisible();
  });

  test("creating a project with a new role succeeds", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Create Project" }).click();

    await page.getByPlaceholder("Please enter Project Name.").click();
    await page
      .getByPlaceholder("Please enter Project Name.")
      .fill("TestProject");
    await page.getByPlaceholder("Please enter Project Description.").click();
    await page
      .getByPlaceholder("Please enter Project Description.")
      .fill("Project for test");
    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Create Role" }).click();
    await page.getByLabel("Role Name").click();
    await page.getByLabel("Role Name").fill("Test Role");
    await page.getByRole("button", { name: "OK" }).click();
    await page
      .getByRole("cell", { name: "Test Role" })
      .getByRole("button")
      .click();
    await page.locator("li").filter({ hasText: "Edit Role" }).click();
    await page
      .getByRole("row", { name: "Edit Feedback" })
      .getByRole("checkbox")
      .nth(3)
      .check();
    await page
      .getByRole("cell", { name: "Test Role" })
      .getByRole("button")
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "Complete" }).click();
    await expect(page.getByText("Project Creation Complete")).toBeVisible();
    await expect(page.locator("#Project\\ Name")).toHaveValue("TestProject");
    await expect(page.locator("#Project\\ Description")).toHaveValue(
      "Project for test"
    );
    await page
      .locator("div")
      .filter({ hasText: /^Role Management$/ })
      .getByRole("button")
      .click();
    await expect(page.getByText("Test Role")).toBeVisible();
    await expect(
      page
        .getByRole("row", { name: "Edit Feedback" })
        .getByRole("checkbox")
        .nth(3)
    ).toBeChecked();
    await page.getByRole("button", { name: "Later" }).click();
    await expect(page.getByText("TestProject")).toBeVisible();
  });
};
