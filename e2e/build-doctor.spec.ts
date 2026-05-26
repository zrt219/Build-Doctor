import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const portfolioQaDir = ".qa/portfolio-mainframe";

test.beforeAll(() => {
  mkdirSync(portfolioQaDir, { recursive: true });
});

test("presents the AI engineering portfolio mainframe", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: /AI engineering systems built like a proof layer/i })).toBeVisible();
  await expect(page.getByText("Visual style follows the supplied reference, but evidence does not.")).toBeVisible();
  await expect(page.getByRole("link", { name: /View GitHub/i }).first()).toHaveAttribute("href", "https://github.com/zrt219");
  await expect(page.getByRole("link", { name: /Email Zhane/i }).first()).toHaveAttribute("href", "mailto:zpeace11@gmail.com");
  await expect(page.getByRole("link", { name: /View Workflow Snapshot/i })).toHaveAttribute("href", "#workflow-tracker");
  const workflowTracker = page.locator("#workflow-tracker");
  await expect(workflowTracker.getByRole("heading", { name: /Evidence-maintained telemetry from Codex session logs/i })).toBeVisible();
  await expect(workflowTracker.getByText("1,160,551").first()).toBeVisible();
  await expect(page.locator("svg[aria-label='Workflow events draggable chart for workflow tracker history']")).toBeVisible();
  await expect(page.getByText("Not image-derived")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Searchable proof-backed project map." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What the work proves." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How Codex work becomes proof instead of loose claims." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public-safe proof sources and live check routes." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A fast route through the strongest technical evidence." })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("keeps sticky nav, hash links, and command palette interactive", async ({ page }) => {
  await page.goto("/");

  const stickyHeader = page.locator("header", { has: page.getByLabel("Open command palette") });
  await expect(stickyHeader).toBeVisible();
  await expect(stickyHeader).toHaveCSS("position", "sticky");

  const hashes = await page.locator("a[href^='#']").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );
  for (const hash of hashes) {
    await expect(page.locator(hash!)).toHaveCount(1);
  }

  const nav = page.getByRole("navigation", { name: "Portfolio sections" });
  await expect(nav.getByRole("link", { name: "Proof" })).toHaveAttribute("href", "#metrics");
  await nav.getByRole("link", { name: "Workflow" }).click();
  await expect(page.locator("#workflow-tracker")).toBeInViewport();

  await page.keyboard.press("ControlOrMeta+K");
  const dialog = page.getByRole("dialog", { name: "Portfolio command palette" });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel("Search commands")).toBeFocused();
  await page.getByLabel("Search commands").fill("build");
  await expect(dialog.getByRole("link", { name: /Try Build Doctor/i })).toHaveAttribute("href", "/build-doctor");
  await page.getByLabel("Search commands").fill("ledger");
  await expect(dialog.getByRole("link", { name: /Open Evidence Ledger/i })).toHaveAttribute("href", "#evidence-ledger");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.keyboard.press("ControlOrMeta+K");
  await expect(page.getByLabel("Search commands")).toHaveValue("");
  await page.keyboard.press("Escape");
});

test("copies contact email with visible feedback", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await expect(page.getByText("zpeace11@gmail.com").first()).toBeVisible();
  const copyButton = page.getByRole("button", { name: /Copy Zhane email address/i });
  await copyButton.click();
  await expect(copyButton).toContainText("Copied");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("zpeace11@gmail.com");
});

test("upgrades live workflow tracker interactions and evidence drawer", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const tracker = page.locator("#workflow-tracker");
  await expect(tracker.getByText("Static evidence snapshot")).toBeVisible();
  await expect(tracker.getByText("Manual refresh reads the public-safe snapshot endpoint. It does not expose raw logs or private paths.")).toBeVisible();
  await expect(tracker.getByText("Drag the highlighted evidence node or chart rail to inspect points. Arrow keys move the selected date.")).toBeVisible();
  await expect(tracker.getByText("This is not a real-time stream")).toBeVisible();
  await expect(tracker.getByText("Only aggregate metrics are shown. Raw logs, private paths, secrets, and local file contents are not exposed.")).toBeVisible();

  await tracker.getByRole("button", { name: "Session rows" }).click();
  await expect(page.locator("svg[aria-label='Session rows draggable chart for workflow tracker history']")).toBeVisible();
  await expect(tracker.getByText("Codex session rows")).toBeVisible();
  await expect(tracker.getByText("Session index rows aligned to local session logs in the dated evidence refresh.")).toBeVisible();
  await expect(tracker.getByText("Showing Session rows")).toBeVisible();
  await expect(tracker.getByText("2026-05-26: Session rows 757.")).toBeVisible();
  await expect(tracker.getByText(/757 sessions/i)).toBeVisible();

  await tracker.getByRole("button", { name: "Daily delta" }).click();
  await expect(page.locator("svg[aria-label='Daily delta draggable chart for workflow tracker history']")).toBeVisible();
  await expect(tracker.getByText("daily event delta")).toBeVisible();
  await expect(tracker.getByText("Workflow-event growth compared with the previous tracker snapshot.")).toBeVisible();
  await expect(tracker.getByText("Showing Daily delta")).toBeVisible();
  await expect(tracker.getByText("2026-05-26: Daily delta 0.")).toBeVisible();
  await expect(tracker.getByText(/0 daily delta/i)).toBeVisible();

  await tracker.getByRole("button", { name: "How this works" }).click();
  const drawer = page.getByRole("dialog", { name: "Public-safe tracker sources" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("Private filesystem paths and raw session logs are intentionally hidden.")).toBeVisible();
  await expect(drawer.getByText("Public-safe tracker summary")).toBeVisible();
  await drawer.getByRole("button", { name: "Close tracker evidence drawer" }).click();
  await expect(drawer).toHaveCount(0);

  await tracker.getByRole("button", { name: "Copy Live Workflow Events Tracker metric summary" }).click();
  await expect(tracker.getByRole("button", { name: "Copy Live Workflow Events Tracker metric summary" })).toContainText("Copied");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("1,160,551 workflow events");
});

test("supports draggable tracker scrubber and public snapshot refresh", async ({ page }) => {
  await page.goto("/");
  const tracker = page.locator("#workflow-tracker");
  const chart = page.locator("svg[aria-label='Workflow events draggable chart for workflow tracker history']");
  await tracker.scrollIntoViewIfNeeded();
  await expect(chart).toBeVisible();
  await expect(tracker.getByText("2026-05-26: Workflow events 1,160,551.")).toBeVisible();

  const chartBox = await chart.boundingBox();
  expect(chartBox).toBeTruthy();
  const scrubberRail = chart.getByTestId("workflow-scrubber-rail");
  const scrubberHandle = chart.getByTestId("workflow-scrubber-handle");
  await page.mouse.move(chartBox!.x + chartBox!.width - 24, chartBox!.y + chartBox!.height / 2);
  await page.mouse.down();
  await expect(tracker.getByTestId("workflow-scrub-state")).toContainText("Scrubbing timeline");
  await page.mouse.move(chartBox!.x + chartBox!.width * 0.55, chartBox!.y + chartBox!.height / 2);
  const midPreviewRailX = Number(await chart.getByTestId("workflow-scrub-preview-rail").getAttribute("x1"));
  const selectedRailX = Number(await scrubberRail.getAttribute("x1"));
  const selectedHandleX = Number(await scrubberHandle.getAttribute("cx"));
  expect(midPreviewRailX).toBeGreaterThan(100);
  expect(midPreviewRailX).toBeLessThan(620);
  expect(selectedHandleX).toBe(selectedRailX);
  await expect(tracker.getByText("The highlighted handle stays on the nearest dated evidence node; the faint preview rail follows your pointer.")).toBeVisible();
  await page.mouse.move(chartBox!.x + 24, chartBox!.y + chartBox!.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect(tracker.getByTestId("workflow-scrub-state")).toContainText("Showing Workflow events");
  await expect(tracker.getByText("2026-05-23: Workflow events 1,135,833.")).toBeVisible();

  await chart.focus();
  await page.keyboard.press("ArrowRight");
  await expect(tracker.getByText("2026-05-24: Workflow events 1,160,551.")).toBeVisible();

  await tracker.getByRole("button", { name: "Refresh public-safe workflow tracker snapshot" }).click();
  await expect(tracker.getByText(/Snapshot refreshed from public API at/i)).toBeVisible();
});

test("shows safe fallback copy when tracker refresh endpoint fails", async ({ page }) => {
  await page.route("**/api/workflow-tracker", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: { code: "UNAVAILABLE", message: "Unavailable." } }),
    });
  });

  await page.goto("/");
  const tracker = page.locator("#workflow-tracker");
  await tracker.getByRole("button", { name: "Refresh public-safe workflow tracker snapshot" }).click();
  await expect(tracker.getByText("Refresh unavailable. Showing bundled public-safe snapshot.")).toBeVisible();
  await expect(tracker.getByText("1,160,551").first()).toBeVisible();
});

test("keeps the portfolio directory free of noisy deployment status badges", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Searchable proof-backed project map." })).toBeVisible();
  await expect(page.getByText("Production link provided")).toHaveCount(0);
  await expect(page.getByText("URL provided")).toHaveCount(0);
  await expect(page.getByText("Git connection needs review")).toHaveCount(0);
  await expect(page.getByText("Vercel list reported no production deployment")).toHaveCount(0);
});

test("keeps public portfolio wording natural and non-meta", async ({ page }) => {
  await page.goto("/");

  const visibleText = await page.locator("body").innerText();
  expect(visibleText).not.toMatch(/employer-facing portfolio/i);
  expect(visibleText).not.toMatch(/recruiter-ready/i);
  expect(visibleText).not.toMatch(/recruiter 90-second path/i);
  expect(visibleText).not.toMatch(/what an employer can verify/i);
  expect(visibleText).not.toMatch(/hiring signals/i);
  expect(visibleText).not.toMatch(/built for recruiters/i);
  expect(visibleText).not.toMatch(/recruiter-facing/i);
  expect(visibleText).not.toMatch(/reviewer-facing/i);
});

test("presents the Evidence Dashboard as the signature portfolio project", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: /AI engineering systems built like a proof layer/i })).toBeVisible();
  const featuredSection = page.locator("section", { hasText: "Featured proof systems" });
  await expect(featuredSection.getByRole("link", { name: /Open demo/i }).first()).toHaveAttribute("href", "https://zhane-grey-evidence-dashboard.vercel.app");
  await expect(featuredSection.getByRole("link", { name: /GitHub/i }).first()).toHaveAttribute("href", "https://github.com/zrt219/AI-Engineering-Evidence-Engine");
  await expect(page.getByRole("link", { name: /Try Build Doctor/i })).toHaveAttribute("href", "/build-doctor");

  const projectCards = featuredSection.locator("article");
  await expect(projectCards.first()).toContainText("Zhane Grey Evidence Dashboard");
  await expect(projectCards.first()).toContainText("Signature proof surface");
});

test("keeps root page links concrete and mobile-readable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: /AI engineering systems built like a proof layer/i })).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);

  const links = await page.getByRole("link").evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      text: anchor.textContent?.replace(/\s+/g, " ").trim() ?? "",
      href: anchor.getAttribute("href"),
    })),
  );

  expect(links.length).toBeGreaterThan(30);
  for (const link of links) {
    expect(link.href, `Missing href for ${link.text}`).toBeTruthy();
    expect(link.href, `Weak href for ${link.text}`).not.toBe("#");
  }

  await expect(page.getByLabel("Mobile portfolio sections")).toBeVisible();
  await expect(page.getByRole("link", { name: /View GitHub/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Try Build Doctor/i })).toBeVisible();
});

test("filters project directory and preserves proof-status semantics", async ({ page }) => {
  await page.goto("/");
  const projectSection = page.locator("#projects");

  await page.getByRole("button", { name: "Web3 / Solidity / Foundry" }).click();
  await expect(page.getByRole("button", { name: "Web3 / Solidity / Foundry" })).toHaveAttribute("aria-pressed", "true");
  await expect(projectSection.getByText(/proof-backed projects/i)).toBeVisible();
  await expect(projectSection.getByRole("heading", { name: "DatumX" })).toBeVisible();
  await expect(projectSection.getByRole("heading", { name: "Vercel Build Doctor Agent" })).toHaveCount(0);

  await page.getByRole("button", { name: "Public demo" }).click();
  await expect(projectSection.getByRole("heading", { name: "Ethex Dynamic House Edge Console" })).toHaveCount(0);
  await expect(projectSection.getByRole("heading", { name: "Unknown002" })).toHaveCount(0);
  await expect(projectSection.getByRole("heading", { name: "AI Agents for Beginners" })).toHaveCount(0);

  await page.getByLabel("Search projects").fill("gateway");
  await page.getByRole("button", { name: "All" }).click();
  await expect(projectSection.getByRole("heading", { name: "AI Gateway Failover Playground" })).toBeVisible();
  await expect(projectSection.getByRole("link", { name: /View proof brief for AI Gateway Failover Playground/i })).toHaveAttribute("href", "/projects/ai-gateway-failover");
  await expect(projectSection.getByRole("heading", { name: "DatumX" })).toHaveCount(0);
  await expect(projectSection.getByText("Search: gateway")).toBeVisible();
  await page.getByRole("button", { name: "Clear project search" }).click();
  await expect(page.getByLabel("Search projects")).toHaveValue("");
  await page.getByRole("button", { name: "Proof brief" }).click();
  await expect(projectSection.getByRole("heading", { name: "Zhane Grey Evidence Dashboard" })).toBeVisible();
  await expect(projectSection.getByRole("heading", { name: "Enterprise Agent Workflow Studio" })).toBeVisible();
  await expect(projectSection.getByRole("heading", { name: "DatumX" })).toHaveCount(0);
  await page.getByRole("button", { name: "All" }).click();
  await page.getByLabel("Search projects").fill("local evidence");
  await expect(projectSection.getByRole("heading", { name: "UO2X / Nuclear Frontier" })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Search projects")).toHaveValue("");

  const chart = page.locator("svg[aria-label='Workflow events draggable chart for workflow tracker history']");
  const chartBox = await chart.boundingBox();
  expect(chartBox?.width).toBeGreaterThan(300);
  expect(chartBox?.height).toBeGreaterThan(120);

  await expect(page.getByText("Last refreshed 2026-05-26")).toBeVisible();
  await expect(page.getByText("Only aggregate metrics are shown. Raw logs, private paths, secrets, and local file contents are not exposed.")).toBeVisible();
});

test("opens signature proof briefs from featured cards and command palette", async ({ page }) => {
  await page.goto("/");

  const featuredSection = page.locator("#featured-projects");
  await expect(featuredSection.getByRole("link", { name: /View proof brief for Zhane Grey Evidence Dashboard/i })).toHaveAttribute("href", "/projects/evidence-dashboard");
  await expect(featuredSection.getByRole("link", { name: /View proof brief for Vercel Build Doctor Agent/i })).toHaveAttribute("href", "/projects/build-doctor");
  await expect(featuredSection.getByRole("link", { name: /View proof brief for Resume Evidence RAG Auditor/i })).toHaveAttribute("href", "/projects/resume-evidence-rag-auditor");

  await page.keyboard.press("ControlOrMeta+K");
  await page.getByLabel("Search commands").fill("gateway proof");
  await expect(page.getByRole("dialog", { name: "Portfolio command palette" }).getByRole("link", { name: /AI Gateway Failover Playground proof brief/i })).toHaveAttribute("href", "/projects/ai-gateway-failover");
});

test("renders each signature proof page as a public-safe project brief", async ({ page }) => {
  const briefs = [
    { slug: "evidence-dashboard", title: "Zhane Grey Evidence Dashboard", expectedLink: "https://zhane-grey-evidence-dashboard.vercel.app" },
    { slug: "build-doctor", title: "Vercel Build Doctor Agent", expectedLink: "https://vercel-build-doctor-agent.vercel.app/build-doctor" },
    { slug: "resume-evidence-rag-auditor", title: "Resume Evidence RAG Auditor", expectedLink: "https://resume-evidence-rag-auditor.vercel.app" },
    { slug: "ai-gateway-failover", title: "AI Gateway Failover Playground", expectedLink: "https://ai-gateway-failover-playground.vercel.app" },
    { slug: "enterprise-workflow", title: "Enterprise Agent Workflow Studio", expectedLink: "https://enterprise-agent-workflow-studio.vercel.app" },
  ];

  for (const brief of briefs) {
    await page.goto(`/projects/${brief.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: brief.title })).toBeVisible();
    await expect(page.getByText("Signature proof brief")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Current proof state." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Boundaries stay visible." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Open the proof trail." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open demo/i })).toHaveAttribute("href", brief.expectedLink);
    await expect(page.getByRole("link", { name: /Back to featured systems/i })).toHaveAttribute("href", "/#featured-projects");

    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toMatch(/C:\\Users\\|AFTER DIARY QUEEN|Documents\\/i);
    expect(visibleText).not.toMatch(/employer-facing portfolio|built for recruiters|recruiter-facing|reviewer-facing/i);
  }
});

test("links evidence ledger source files to public GitHub blobs", async ({ page }) => {
  await page.goto("/#evidence-ledger");

  const ledger = page.locator("#evidence-ledger");
  await expect(ledger.getByRole("link", { name: /Open public-safe source file for Workflow events tracker/i })).toHaveAttribute(
    "href",
    "https://github.com/zrt219/Zhanes-Portfolio-Vercel-/blob/master/evidence/public/live-workflow-events-tracker.md",
  );
  await expect(ledger.getByRole("link", { name: /Open public-safe source file for Daily evidence report/i })).toHaveAttribute(
    "href",
    "https://github.com/zrt219/Zhanes-Portfolio-Vercel-/blob/master/evidence/public/daily-evidence-report-2026-05-24.md",
  );
  await expect(ledger.getByRole("link", { name: /Open public-safe source file for Codex session summary/i })).toHaveAttribute(
    "href",
    "https://github.com/zrt219/Zhanes-Portfolio-Vercel-/blob/master/evidence/public/session-index-summary.md",
  );
});

test("keeps signature proof pages mobile-readable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/build-doctor");

  await expect(page.getByRole("heading", { level: 1, name: "Vercel Build Doctor Agent" })).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
  await expect(page.getByRole("link", { name: /Open demo/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /GitHub repo/i })).toBeVisible();
});

test("keeps outbound links and email CTA public-safe", async ({ page }) => {
  await page.goto("/");

  const outboundIssues = await page.locator("a[href^='http']").evaluateAll((anchors) =>
    anchors
      .map((anchor) => ({
        text: anchor.textContent?.replace(/\s+/g, " ").trim() ?? "",
        href: anchor.getAttribute("href"),
        target: anchor.getAttribute("target"),
        rel: anchor.getAttribute("rel") ?? "",
      }))
      .filter((anchor) => !anchor.href?.startsWith("https://") || anchor.target !== "_blank" || !anchor.rel.includes("noreferrer")),
  );
  expect(outboundIssues).toEqual([]);

  await expect(page.getByRole("link", { name: /Email Zhane/i }).first()).toHaveAttribute("href", "mailto:zpeace11@gmail.com");
  await expect(page.getByText("zpeace11@gmail.com").first()).toBeVisible();
  await expect(page.getByText("© 2026 Zhane Grey. Public AI engineering portfolio.")).toBeVisible();
  await expect(page.getByText("Â©")).toHaveCount(0);
  const artworkCredit = page.getByRole("link", { name: /Artwork credit: Arnold Böcklin/i });
  await expect(artworkCredit).toContainText("Artwork: Böcklin, The Isle of the Dead, 1883 · Public domain");
  await expect(artworkCredit).toHaveAttribute(
    "href",
    "https://commons.wikimedia.org/wiki/File:Arnold_B%C3%B6cklin_-_Die_Toteninsel_III_(Alte_Nationalgalerie,_Berlin).jpg",
  );
  await expect(artworkCredit).toHaveAttribute("target", "_blank");
  await expect(artworkCredit).toHaveAttribute("rel", "noreferrer");
  await expect(artworkCredit).toHaveAttribute("title", /Alte Nationalgalerie, Berlin/);
  await expect(page.getByText(/\d{3}[-.) ]?\d{3}[-. ]?\d{4}/)).toHaveCount(0);
  await expect(page.getByText(/C:\\Users\\|AFTER DIARY QUEEN|Documents\\/i)).toHaveCount(0);
});

test("captures portfolio mainframe screenshots across desktop tablet and mobile", async ({ page }) => {
  const viewports = [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "tablet", width: 834, height: 1112 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /AI engineering systems built like a proof layer/i })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
    await page.screenshot({ path: `${portfolioQaDir}/${viewport.name}-home.png`, fullPage: true });
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByLabel("Open command palette").click();
  await page.getByLabel("Search commands").fill("ledger");
  await page.screenshot({ path: `${portfolioQaDir}/desktop-command-palette-ledger.png`, fullPage: false });
});

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
