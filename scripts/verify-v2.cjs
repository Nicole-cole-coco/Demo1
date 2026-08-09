const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:3000";
const screenshots = {
  resultDesktop: "E:\\MBTI\\.next\\qa-result-desktop.png",
  chatDesktop: "E:\\MBTI\\.next\\qa-chat-desktop.png",
  resultMobile: "E:\\MBTI\\.next\\qa-result-mobile.png",
  chatMobile: "E:\\MBTI\\.next\\qa-chat-mobile.png"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertNoOverflow(page, label) {
  const sizes = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert(sizes.scrollWidth <= sizes.clientWidth + 1, `${label} has horizontal overflow: ${JSON.stringify(sizes)}`);
}

async function assertImagesLoaded(page, label) {
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src"))
  );
  assert(broken.length === 0, `${label} has broken images: ${broken.join(", ")}`);
}

async function testPersonaReplies() {
  const types = ["INTJ", "INFP", "ENFP", "ENTJ"];
  const replies = [];
  for (const mbti of types) {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "我今天和朋友发生了矛盾，现在不知道怎么沟通。",
        profile: { mbti, gender: "female", avatar: `/avatars/${mbti.toLowerCase()}-female.webp` },
        history: [],
        scenario: "conflict"
      })
    });
    assert(response.ok, `${mbti} API request failed with ${response.status}`);
    const data = await response.json();
    assert(data.mode === "demo" || data.mode === "live", `${mbti} returned invalid mode`);
    assert(typeof data.reply === "string" && data.reply.length > 30, `${mbti} returned a short reply`);
    replies.push(data.reply);
  }
  assert(new Set(replies).size === types.length, "Representative persona replies are not distinct");
  return types.map((mbti, index) => `${mbti}: ${replies[index].slice(0, 42)}`).join("\n");
}

(async () => {
  console.log("[qa] launching Chrome");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.setDefaultNavigationTimeout(20000);
  console.log("[qa] Chrome ready");
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(`${baseUrl}/test`, { waitUntil: "networkidle" });
  console.log("[qa] test loaded");
  const answerSequence = ["I", "I", "I", "N", "N", "N", "T", "T", "T", "J", "J", "J"];
  for (let index = 0; index < answerSequence.length; index += 1) {
    const letter = answerSequence[index];
    await page.locator(`[data-letter="${letter}"]`).click();
    await page.waitForTimeout(260);
    console.log(`[qa] answered ${index + 1}/12: ${letter}`);
  }

  await page.waitForURL("**/result");
  console.log("[qa] result loaded");
  await page.getByRole("heading", { name: "INTJ", exact: true }).waitFor();
  await assertNoOverflow(page, "desktop result");
  await assertImagesLoaded(page, "desktop result");
  await page.screenshot({ path: screenshots.resultDesktop, fullPage: true });
  console.log("[qa] desktop result passed");

  await page.getByRole("button", { name: /男性形象/ }).click();
  await page.getByRole("link", { name: /与 INTJ 人格伙伴开始对话/ }).click();
  await page.waitForURL("**/chat");
  await page.getByRole("button", { name: "朋友矛盾" }).click();
  await page.getByText(/Persona 演示模式|AI 实时回复/).waitFor({ timeout: 15000 });
  console.log("[qa] chat response received");
  await assertNoOverflow(page, "desktop chat");
  await assertImagesLoaded(page, "desktop chat");
  await page.screenshot({ path: screenshots.chatDesktop, fullPage: true });
  console.log("[qa] desktop chat passed");

  const persisted = await page.evaluate(() => localStorage.getItem("mbti-ai-companion"));
  assert(persisted && persisted.includes("INTJ") && persisted.includes("messages"), "Companion profile or messages were not persisted");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/result`, { waitUntil: "networkidle" });
  await assertNoOverflow(page, "mobile result");
  await assertImagesLoaded(page, "mobile result");
  await page.screenshot({ path: screenshots.resultMobile, fullPage: true });
  console.log("[qa] mobile result passed");

  await page.goto(`${baseUrl}/chat`, { waitUntil: "networkidle" });
  await assertNoOverflow(page, "mobile chat");
  await assertImagesLoaded(page, "mobile chat");
  await page.screenshot({ path: screenshots.chatMobile, fullPage: true });
  console.log("[qa] mobile chat passed");

  const personaSummary = await testPersonaReplies();
  console.log("[qa] persona API comparison passed");
  assert(consoleErrors.length === 0, `Browser console errors:\n${consoleErrors.join("\n")}`);
  await browser.close();

  console.log("V2 browser flow passed.");
  console.log(personaSummary);
  console.log(Object.values(screenshots).join("\n"));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
