import { expect, test } from "@playwright/test";

test("runs the five-step Build Doctor workflow", async ({ page }) => {
  await page.route("**/api/enrich", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        aiPatchReview: null,
        providerStatus: "free_model_rate_limited",
        error: "DeepSeek free provider is rate-limited. Deterministic diagnosis remains available.",
      }),
    });
  });

  await page.goto("/build-doctor");

  await expect(page.getByRole("heading", { level: 1, name: "Find the root cause in failed Vercel builds." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Run Demo Diagnosis/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View Case Study/i })).toBeVisible();
  await expect(page.getByText("Deterministic engine").first()).toBeVisible();
  await expect(page.getByText("Paste logs").first()).toBeVisible();
  await expect(page.getByText("Demo path")).toBeVisible();
  await expect(page.getByText("Active demo")).toBeVisible();

  await page.getByRole("button", { name: /TypeScript property does not exist/i }).click();
  await page.getByRole("button", { name: /Run diagnosis/i }).click();

  await expect(page.getByRole("heading", { level: 2, name: "TypeScript compile error" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Local diagnostic trace/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Safe patch draft/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Suggested solutions/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Autofill Fix Plan/i })).toBeVisible();
  await expect(page.getByLabel("Editable autofill fix plan")).toHaveValue(/Align the referenced type contract/);
  await page.getByRole("button", { name: /Copy commands/i }).click();
  await expect(page.getByText("Commands copied")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Live DeepSeek review/i })).toBeVisible();
  await page.getByRole("button", { name: /Run DeepSeek review/i }).click();
  await expect(page.getByRole("heading", { name: "DeepSeek free review is rate-limited" })).toBeVisible();
  await expect(page.getByText("DeepSeek free review is currently rate-limited. The deterministic diagnosis, trace, patch draft, and report export are still available.")).toBeVisible();
  await expect(page.getByText("Core diagnosis: Complete")).toBeVisible();
  await expect(page.getByText("DeepSeek review: Rate-limited")).toBeVisible();
  await expect(page.getByText("Report export: Available")).toBeVisible();
  await expect(page.getByText(/Provider status: free_model_rate_limited/i)).toBeVisible();
  await expect(page.getByText("Cached DeepSeek demo review")).toBeVisible();
  await expect(page.getByText("Live DeepSeek review is currently rate-limited. This cached example shows the expected review format.")).toBeVisible();
  await expect(page.getByText("Cached provider review example, not live output")).toBeVisible();
  await expect(page.getByText(/Demo fixture \/ TYPESCRIPT_ERROR \/ not live output/i)).toBeVisible();
  await expect(page.getByText(/DeepSeek review added/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2, name: "TypeScript compile error" })).toBeVisible();

  await page.getByRole("button", { name: /Generate report/i }).click();
  await expect(page.getByText("# Build Doctor Incident Report")).toBeVisible();
  await expect(page.getByText("## Suggested Solutions")).toBeVisible();
  await expect(page.getByText("## Autofill Fix Plan")).toBeVisible();
  await expect(page.getByText("Optional DeepSeek review was not included because the free provider was rate-limited. The deterministic diagnosis remains the source of truth.")).toBeVisible();
  await expect(page.getByText("Cached provider review example, not live output").first()).toBeVisible();
  await expect(page.getByText("- Optional provider status: free_model_rate_limited")).toBeVisible();

  await page.getByRole("button", { name: /Copy markdown/i }).click();
  await expect(page.getByText(/^Copied$/)).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download Markdown/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("build-doctor-report-typescript_error.md");
});

test("shows live DeepSeek review when OpenRouter succeeds", async ({ page }) => {
  await page.route("**/api/enrich", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        providerStatus: "openrouter_success",
        aiPatchReview: {
          enabled: true,
          provider: "openrouter",
          model: "deepseek/deepseek-v4-flash:free",
          summary: "Live DeepSeek review confirms the deterministic patch draft matches the evidence.",
          improvedExplanation: "The TypeScript contract should be aligned before another Vercel build.",
          patchReview: "Review the field name and rerun typecheck.",
          cautions: ["Do not auto-apply this patch."],
          suggestedVerification: ["npm run typecheck", "npm run build"],
          confidence: "medium",
          usedSanitizedInputOnly: true,
        },
      }),
    });
  });

  await page.goto("/build-doctor");
  await page.getByRole("button", { name: /TypeScript property does not exist/i }).click();
  await page.getByRole("button", { name: /Run diagnosis/i }).click();
  await page.getByRole("button", { name: /Run DeepSeek review/i }).click();

  await expect(page.getByText("DeepSeek review added")).toBeVisible();
  await expect(page.getByText("Live DeepSeek review confirms the deterministic patch draft matches the evidence.")).toBeVisible();
  await expect(page.getByText(/Provider status: openrouter_success/i)).toBeVisible();
  await expect(page.getByText("Cached provider review example, not live output")).toHaveCount(0);
});

test("validates empty logs and supports UNKNOWN manual paste", async ({ page }) => {
  await page.goto("/build-doctor");

  await page.getByLabel("Build log input").click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await expect(page.getByRole("button", { name: /Run diagnosis/i })).toBeDisabled();

  await page.getByLabel("Build log input").fill("[SIMULATED VERCEL LOG]\nUnhandled vendor failure without known rule");
  await page.getByRole("button", { name: /Run diagnosis/i }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Unknown failure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Collect more context before drafting a code change/i }).first()).toBeVisible();
});

test("keeps core workflow reachable on mobile and keyboard navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/build-doctor");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /Run diagnosis/i })).toBeVisible();
  await page.getByRole("button", { name: /Run diagnosis/i }).click();
  await expect(page.getByRole("heading", { name: /Local diagnostic trace/i })).toBeVisible();
});
