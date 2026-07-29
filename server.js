// 幸福水屋 業務培訓站 — 靜態網頁伺服器 + QA 問答 AI 後端
//
// 用途：
//   1. 提供 index.html / compare.html / calculator.html / qa.html 等靜態頁面
//   2. 提供 POST /api/ask，讀取 knowledge.md 當作 system prompt，呼叫 Claude API 即時回答加盟問題
//
// 使用方式：
//   1. npm install
//   2. 複製 .env.example 為 .env，填入你的 ANTHROPIC_API_KEY
//   3. npm start
//   4. 瀏覽器打開 http://localhost:3000

const express = require("express");
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

const knowledgePath = path.join(__dirname, "knowledge.md");
let knowledgeText = "";
try {
  knowledgeText = fs.readFileSync(knowledgePath, "utf-8");
} catch (err) {
  console.error("找不到 knowledge.md，AI 回答會沒有方案細節可以參考：", err.message);
}

const SYSTEM_PROMPT = `你是「幸福水屋」業務培訓站的問答助理，回答對象是公司業務或潛在加盟主。
請完全依據下面提供的知識庫內容回答，不要自行編造合約條款或數字。
回答用自然口語的繁體中文，簡潔但把計算邏輯講清楚，遇到知識庫沒提到的細節，誠實建議對方洽總部窗口確認。

=== 知識庫開始 ===
${knowledgeText}
=== 知識庫結束 ===`;

let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

app.post("/api/ask", async (req, res) => {
  const question = (req.body && req.body.question || "").trim();
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }
  if (!anthropic) {
    return res.status(500).json({
      error: "尚未設定 ANTHROPIC_API_KEY，請在 .env 檔案填入你的 API key 後重新啟動伺服器。",
    });
  }

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const answer = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    res.json({ answer });
  } catch (err) {
    console.error("呼叫 Claude API 失敗：", err.message);
    res.status(500).json({ error: "AI 回應失敗，請稍後再試，或改看上方問答庫。" });
  }
});

app.listen(PORT, () => {
  console.log(`幸福水屋業務培訓站已啟動：http://localhost:${PORT}`);
  if (!anthropic) {
    console.log("提醒：尚未設定 ANTHROPIC_API_KEY，/api/ask 目前無法運作。");
  }
});
