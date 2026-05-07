import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/onboarding");
});

test("onboarding lets user continue to feed", async ({ page }) => {
  await page.getByRole("button", { name: "Clean Girl" }).click();
  await page.getByRole("button", { name: "Zapisz preferencje" }).click();
  await expect(page).toHaveURL(/\/feed/);
  await expect(page.getByRole("heading", { name: "Feed" })).toBeVisible();
});

test("feed filter opens bottom sheet on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Clean Girl" }).click();
  await page.getByRole("button", { name: "Zapisz preferencje" }).click();
  await page.getByRole("button", { name: /Filtry/ }).click();
  await expect(page.getByRole("dialog", { name: "Filtry feedu" })).toBeVisible();
});

test("saved view renders empty state", async ({ page }) => {
  await page.getByRole("button", { name: "Clean Girl" }).click();
  await page.getByRole("button", { name: "Zapisz preferencje" }).click();
  await page.getByRole("link", { name: "Saved" }).click();
  await expect(page.getByRole("heading", { name: "Saved" })).toBeVisible();
  await expect(page.getByText("Nie masz jeszcze zapisanych lookow")).toBeVisible();
});
