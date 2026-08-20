const state = { catalog: [], reviews: { schemaVersion: 1, updatedAt: null, items: {} }, directory: "all", status: "all", query: "", selectedPath: null, selectedFonts: { chinese: null, japanese: null, latin: null } };
const storageKey = "abstract-toy-lab-reviews-v1";
const statusMeta = { pending: { label: "待审批", short: "PENDING" }, approved: { label: "已通过", short: "APPROVED" }, changes_requested: { label: "需修改", short: "REVISE" }, rejected: { label: "不采用", short: "REJECTED" } };
const fonts = [
  { value: "AB ZCOOL KuaiLe", label: "ZCOOL KuaiLe", role: "中文标题", family: "AB ZCOOL KuaiLe", supports: ["chinese", "latin"] },
  { value: "AB Kiwi Maru", label: "Kiwi Maru Medium", role: "日文正文", family: "AB Kiwi Maru", supports: ["japanese", "latin"] },
  { value: "AB Baloo 2", label: "Baloo 2 Bold", role: "英文 / 数字", family: "AB Baloo 2", supports: ["latin"] }
];
const samples = {
  story: { label: "小小的玩具研究所", kicker: "ABSTRACT TOY LAB · 2026", title: [{ lang: "chinese", text: "把小小的想象，做成" }, { lang: "japanese", text: "手に取れる" }, { lang: "chinese", text: "组件。" }], body: [{ lang: "chinese", text: "今天的发现，留给明天的玩具。" }, { lang: "japanese", text: "小さな発見を、明日の遊び道具に。" }, { lang: "latin", text: " We keep the edges round, the colors warm." }], price: "¥ 1,280 · 24 toys" },
  ui: { label: "界面文案与金额", kicker: "AB PURSE · UI COPY SAMPLE", title: [{ lang: "chinese", text: "这笔小钱，也要被" }, { lang: "japanese", text: "やさしく" }, { lang: "chinese", text: "看见。" }], body: [{ lang: "japanese", text: "今月の支出を確認して、次の一歩を選ぼう。" }, { lang: "chinese", text: "看看本月支出，再做下一步选择。" }, { lang: "latin", text: " Balance: ¥ 12,480.50." }], price: "68% · SAVE 320" },
  label: { label: "组件命名标签", kicker: "COMPONENT LABELS · MIXED LANGUAGE", title: [{ lang: "chinese", text: "猫爪按钮 / " }, { lang: "japanese", text: "ねこボタン" }, { lang: "latin", text: " / Cat Paw" }], body: [{ lang: "chinese", text: "圆角、留白、轻轻的倾斜。" }, { lang: "japanese", text: "余白は呼吸のためにあります。" }, { lang: "latin", text: " Tap once, then keep exploring." }], price: "ICON · 32 PX" }
};
const el = Object.fromEntries(["assetsWorkspace", "fontsWorkspace", "assetCount", "directoryTree", "searchInput", "statusFilter", "refreshButton", "importButton", "importInput", "exportButton", "currentFolder", "assetGrid", "emptyState", "reviewDialog", "detailImage", "detailKind", "detailPath", "detailName", "detailCode", "copyDetailCode", "tagInput", "commentInput", "detailUpdated", "saveReviewButton", "assetCardTemplate", "sampleTabs", "fontPreview", "fontRecipe", "fontRoster"].map((id) => [id, document.getElementById(id)]));

function reviewFor(item) { return state.reviews.items[item.path] || { code: item.code, contentHash: item.contentHash, status: "pending", tags: item.defaultTags || [], comment: "", updatedAt: null }; }
function buildDirectories() { const counts = new Map(); state.catalog.forEach((item) => item.directory.split("/").forEach((_, index, parts) => { const directory = parts.slice(0, index + 1).join("/"); counts.set(directory, (counts.get(directory) || 0) + 1); })); return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)); }
function renderTree() {
  el.directoryTree.replaceChildren();
  [["all", state.catalog.length], ...buildDirectories()].forEach(([directory, count]) => {
    const button = document.createElement("button"); const depth = directory === "all" ? 0 : directory.split("/").length - 1;
    button.type = "button"; button.className = `tree-button ${depth ? "nested" : ""} ${state.directory === directory ? "active" : ""}`;
    button.innerHTML = "<span></span><span class=\"tree-count\"></span>";
    button.firstElementChild.textContent = directory === "all" ? "全部作品" : `${"— ".repeat(depth)}${directory.split("/").at(-1)}`;
    button.lastElementChild.textContent = count; button.addEventListener("click", () => { state.directory = directory; render(); }); el.directoryTree.append(button);
  });
}
function filteredItems() { const query = state.query.trim().toLowerCase(); return state.catalog.filter((item) => { const review = reviewFor(item); const inDirectory = state.directory === "all" || item.directory === state.directory || item.directory.startsWith(`${state.directory}/`); const inStatus = state.status === "all" || review.status === state.status; const terms = [item.code, item.name, item.path, ...(review.tags || [])].join(" ").toLowerCase(); return inDirectory && inStatus && (!query || terms.includes(query)); }); }
function renderCards() {
  const items = filteredItems(); el.assetGrid.replaceChildren(); el.emptyState.hidden = items.length > 0;
  const stampItem = state.catalog.find((it) => it.code.startsWith("ATL-CALENDAR-CHECK-IN-STAMP")) || { url: "assets/icons/calendar/check-in-stamp.svg" };
  items.forEach((item, index) => {
    const review = reviewFor(item), card = el.assetCardTemplate.content.firstElementChild.cloneNode(true); card.dataset.status = review.status;
    card.querySelector(".asset-number").textContent = `NO. ${String(index + 1).padStart(3, "0")} / ${item.kind.toUpperCase()}`;
    const mainImage = card.querySelector(".asset-preview img"); mainImage.src = item.url; mainImage.alt = `${item.name} 设计预览`;
    card.querySelector(".asset-name").textContent = item.name; card.querySelector(".asset-path").textContent = item.directory;
    const copy = card.querySelector(".copy-code"); copy.textContent = item.code; copy.title = `复制 ${item.code}`; copy.addEventListener("click", () => copyCode(item.code, copy));
    const approveBtn = card.querySelector(".quick-approve-btn");
    if (approveBtn) {
      const stampImg = approveBtn.querySelector(".quick-stamp-icon");
      if (stampImg) stampImg.src = stampItem.url;
      const stampText = approveBtn.querySelector(".quick-stamp-text");
      if (review.status === "approved") {
        approveBtn.classList.add("is-approved");
        if (stampText) stampText.textContent = "已通过";
        approveBtn.title = "已确认通过（点击设为待审批）";
      } else {
        approveBtn.classList.remove("is-approved");
        if (stampText) stampText.textContent = "确认";
        approveBtn.title = "一键确认通过";
      }
      approveBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleQuickApprove(item);
      });
    }
    card.querySelector(".status-label").textContent = statusMeta[review.status].short; card.querySelector(".asset-open").addEventListener("click", () => openReview(item)); el.assetGrid.append(card);
  });
}
function toggleQuickApprove(item) {
  const review = reviewFor(item);
  const newStatus = review.status === "approved" ? "pending" : "approved";
  state.reviews.items[item.path] = {
    code: item.code,
    contentHash: item.contentHash,
    status: newStatus,
    tags: review.tags || [],
    comment: review.comment || "",
    updatedAt: new Date().toISOString()
  };
  state.reviews.updatedAt = new Date().toISOString();
  localStorage.setItem(storageKey, JSON.stringify(state.reviews));
  render();
}
function render() { el.assetCount.textContent = state.catalog.length; el.currentFolder.textContent = state.directory === "all" ? "ALL ASSETS" : state.directory; renderTree(); renderCards(); }
async function copyCode(code, button) { await navigator.clipboard.writeText(code); const previous = button.textContent; button.textContent = "已复制"; window.setTimeout(() => { button.textContent = previous; }, 1100); }
function openReview(item) {
  const review = reviewFor(item); state.selectedPath = item.path; el.detailImage.src = item.url; el.detailImage.alt = `${item.name} 大图预览`; el.detailKind.textContent = `${item.kind} / ${item.extension}`; el.detailPath.textContent = item.path; el.detailName.textContent = item.name; el.detailCode.textContent = item.code; el.tagInput.value = (review.tags || []).join(", "); el.commentInput.value = review.comment || "";
  el.detailUpdated.textContent = review.updatedAt ? `本浏览器已暂存 ${new Date(review.updatedAt).toLocaleString("zh-CN")}` : "尚未审批"; const radio = el.reviewDialog.querySelector(`input[name="status"][value="${review.status}"]`); if (radio) radio.checked = true; el.reviewDialog.showModal();
}
function saveCurrentReview() {
  const item = state.catalog.find((candidate) => candidate.path === state.selectedPath); if (!item) return; const status = el.reviewDialog.querySelector('input[name="status"]:checked')?.value || "pending";
  state.reviews.items[item.path] = { code: item.code, contentHash: item.contentHash, status, tags: el.tagInput.value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean), comment: el.commentInput.value.trim(), updatedAt: new Date().toISOString() };
  state.reviews.updatedAt = new Date().toISOString(); localStorage.setItem(storageKey, JSON.stringify(state.reviews)); el.detailUpdated.textContent = `已暂存于浏览器 / ${statusMeta[status].label}`; render();
}
function exportReviews() { const blob = new Blob([`${JSON.stringify(state.reviews, null, 2)}\n`], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "reviews.json"; link.click(); URL.revokeObjectURL(link.href); }
async function importReviews(file) {
  if (!file) return; try { const incoming = JSON.parse(await file.text()); if (!incoming?.items || typeof incoming.items !== "object") throw new Error("不是有效的 reviews.json"); state.reviews = { schemaVersion: 1, updatedAt: incoming.updatedAt || null, items: incoming.items }; localStorage.setItem(storageKey, JSON.stringify(state.reviews)); render(); window.alert("审批记录已导入当前浏览器。"); } catch (error) { window.alert(`导入失败：${error.message}`); } finally { el.importInput.value = ""; }
}
const languageLabels = { chinese: "中文", japanese: "日文", latin: "英文/数字" };
function fontName(value) { return fonts.find((font) => font.value === value)?.label || "系统回退"; }
function activeFontFor(language) { return state.selectedFonts[language]; }
function fontStyleFor(language) { const font = activeFontFor(language); return font ? `font-family: &quot;${font}&quot;, sans-serif` : "font-family: var(--system-fallback)"; }
function renderSampleTabs() {
  el.sampleTabs.replaceChildren();
  Object.entries(samples).forEach(([key, sample], index) => {
    const button = document.createElement("button"); button.type = "button"; button.dataset.sample = key; button.className = `sample-tab ${index === 0 ? "active" : ""}`; button.textContent = sample.label;
    button.addEventListener("click", () => { el.sampleTabs.querySelectorAll("button").forEach((tab) => tab.classList.toggle("active", tab === button)); renderFontPreview(key); }); el.sampleTabs.append(button);
  });
}
function renderFontRoster() {
  const activeEntries = Object.entries(state.selectedFonts).filter(([, value]) => value);
  const activeValues = new Set(activeEntries.map(([, value]) => value));
  el.fontRoster.replaceChildren(...fonts.map((font) => {
    const roles = activeEntries.filter(([, value]) => value === font.value).map(([role]) => languageLabels[role]);
    const card = document.createElement("button"); card.type = "button"; card.className = `font-card ${activeValues.has(font.value) ? "selected" : ""}`; card.dataset.font = font.value;
    card.innerHTML = "<span class=\"font-role\"></span><span class=\"font-language-tags\"></span><strong class=\"font-name\">Aa あ 中</strong><span class=\"font-family-code\"></span><span class=\"font-used-for\"></span>";
    card.querySelector(".font-role").textContent = font.role; card.querySelector(".font-name").style.fontFamily = `\"${font.family}\"`; card.querySelector(".font-family-code").textContent = font.label; card.querySelector(".font-used-for").textContent = roles.length ? `正在渲染：${roles.join("、")}` : "点击语言 Tag 选择";
    const tags = card.querySelector(".font-language-tags");
    font.supports.forEach((language) => { const tag = document.createElement("span"); tag.className = `font-language-tag ${state.selectedFonts[language] === font.value ? "active" : ""}`; tag.textContent = languageLabels[language]; tag.addEventListener("click", (event) => { event.stopPropagation(); state.selectedFonts[language] = state.selectedFonts[language] === font.value ? null : font.value; renderFontPreview(); renderFontRoster(); }); tags.append(tag); });
    card.addEventListener("click", () => { const allSelected = font.supports.every((language) => state.selectedFonts[language] === font.value); font.supports.forEach((language) => { state.selectedFonts[language] = allSelected ? null : font.value; }); renderFontPreview(); renderFontRoster(); }); return card;
  }));
  renderSystemFallbackCard();
}
function renderSystemFallbackCard() {
  const missing = Object.keys(state.selectedFonts).filter((language) => !state.selectedFonts[language]);
  const card = document.createElement("article"); card.className = `font-card system-font-card ${missing.length ? "selected" : ""}`;
  card.innerHTML = "<span class=\"font-role\">浏览器 / 系统默认</span><strong class=\"font-name\">Aa あ 中</strong><span class=\"font-family-code\">SYSTEM FALLBACK</span><span class=\"font-used-for\"></span>";
  card.querySelector(".font-name").style.fontFamily = "var(--system-fallback)"; card.querySelector(".font-used-for").textContent = missing.length ? `自动渲染：${missing.map((language) => languageLabels[language]).join("、")}` : "未参与渲染";
  el.fontRoster.append(card);
}
function renderFontPreview(sampleKey) {
  const selectedTab = el.sampleTabs.querySelector("button.active"); const sample = samples[sampleKey || selectedTab?.dataset.sample || "story"];
  const segment = (part) => `<span style="${fontStyleFor(part.lang)}">${part.text}</span>`;
  el.fontPreview.innerHTML = `<p class="sample-kicker" style="${fontStyleFor("latin")}">${sample.kicker}</p><h3 class="sample-title">${sample.title.map(segment).join("")}</h3><p class="sample-body">${sample.body.map(segment).join("")}</p><p class="sample-price" style="${fontStyleFor("latin")}">${sample.price}</p>`;
  el.fontRecipe.textContent = `中文：${fontName(state.selectedFonts.chinese)} · 日文：${fontName(state.selectedFonts.japanese)} · 英文/数字：${fontName(state.selectedFonts.latin)}`;
}
function loadData() {
  const catalog = window.ABSTRACT_TOY_LAB_CATALOG;
  if (!catalog?.items) { el.emptyState.hidden = false; el.emptyState.querySelector("strong").textContent = "无法读取设计目录"; el.emptyState.querySelector("span").textContent = "请先运行 npm run catalog，以生成 data/catalog.js。"; return; }
  state.catalog = catalog.items;
  try { state.reviews = JSON.parse(localStorage.getItem(storageKey)) || window.ABSTRACT_TOY_LAB_REVIEWS || state.reviews; } catch { localStorage.removeItem(storageKey); state.reviews = window.ABSTRACT_TOY_LAB_REVIEWS || state.reviews; }
  render();
}

el.searchInput.addEventListener("input", (event) => { state.query = event.target.value; renderCards(); }); el.statusFilter.addEventListener("change", (event) => { state.status = event.target.value; renderCards(); }); el.refreshButton.addEventListener("click", () => window.location.reload()); el.exportButton.addEventListener("click", exportReviews); el.importButton.addEventListener("click", () => el.importInput.click()); el.importInput.addEventListener("change", (event) => importReviews(event.target.files[0])); el.saveReviewButton.addEventListener("click", saveCurrentReview); el.copyDetailCode.addEventListener("click", () => copyCode(el.detailCode.textContent, el.copyDetailCode)); el.reviewDialog.addEventListener("click", (event) => { if (event.target === el.reviewDialog) el.reviewDialog.close(); });
document.querySelectorAll(".work-tab").forEach((tab) => tab.addEventListener("click", () => { const fontsTab = tab.dataset.tab === "fonts"; document.querySelectorAll(".work-tab").forEach((button) => { const active = button === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); }); el.assetsWorkspace.hidden = fontsTab; el.fontsWorkspace.hidden = !fontsTab; }));
renderSampleTabs(); renderFontPreview(); renderFontRoster(); loadData();
