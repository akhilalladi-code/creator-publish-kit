import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("loads the publishing workspace and all five sections", async ({ page }) => {
  await expect(page).toHaveTitle(/Creator Publish Kit/);
  await expect(page.getByRole("heading", { name: "Video details" })).toBeVisible();
  for (const name of ["01 Details", "02 Chapters", "03 Thumbnail", "04 Checklist", "05 Preview & export"]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
});

test("persists video metadata after reload", async ({ page }) => {
  await page.locator("#title").fill("Playwright regression test");
  await page.locator("#description").fill("A browser test verifies local-first draft persistence.");
  await page.reload();
  await expect(page.locator("#title")).toHaveValue("Playwright regression test");
  await expect(page.locator("#description")).toHaveValue("A browser test verifies local-first draft persistence.");
  await expect(page.locator("#save-status")).toContainText("Saved locally");
});

test("updates launch checklist progress", async ({ page }) => {
  await page.getByRole("button", { name: "04 Checklist" }).click();
  await expect(page.locator("#progress")).toHaveText("0 / 8 complete");
  await page.locator('[data-check="metadata"]').check();
  await expect(page.locator("#progress")).toHaveText("1 / 8 complete");
  await expect(page.locator("#progress-bar")).toHaveCSS("width", /.+/);
});

test("imports a valid JSON project and reports success", async ({ page }) => {
  const project = {
    title: "Imported from E2E",
    description: "Imported description",
    tags: "testing, automation",
    keyword: "browser testing",
    audience: "QA engineers",
    cta: "Try it",
    format: "Long-form",
    visibility: "Unlisted",
    language: "English",
    chapters: "",
    checklist: { metadata: true, chapters: false, thumbnail: false, links: false, captions: false, visibility: false, "end-screen": false, "final-playback": false }
  };
  await page.locator("#import-json").setInputFiles({
    name: "project.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project))
  });
  await expect(page.locator("#import-result")).toHaveText("Project imported and validated.");
  await expect(page.locator("#title")).toHaveValue("Imported from E2E");
  await expect(page.locator("#visibility")).toHaveValue("Unlisted");
});

test("rejects malformed JSON without breaking the workspace", async ({ page }) => {
  await page.locator("#import-json").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from("{not valid json")
  });
  await expect(page.locator("#import-result")).toContainText("JSON");
  await expect(page.locator("#title")).toBeVisible();
});

test("exports a JSON publishing pack", async ({ page }) => {
  await page.locator("#title").fill("Export browser test");
  await page.getByRole("button", { name: "05 Preview & export" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-json").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("creator-publish-kit.json");
});

test("supports a mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Video details" })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});
