# AI_reference

## AI 工具

- 工具名稱：OpenAI ChatGPT / Codex
- 模型：GPT-5 系列
- 使用日期：2026/05/25
- 使用目的：協助整理 Web Mario 作業需求、檢查既有 HTML5 Canvas prototype 與評分項目的落差、對齊 Cocos Creator 2.4.8 的輸出與部署要求、補齊遊戲流程與關卡互動、檢查 Firebase Hosting 部署設定、協助改寫 README 與 AI reference。

## 使用原則與個人貢獻聲明

本專案並非從空白開始。在本次 Codex 協作開始前，我已準備 Web Mario 的初版專案與課程提供/選用的素材，專案資料夾中已有 `index.html`、`style.css`、`main.js`、音訊與圖片素材，以及初版的 `README.md` 與 `AI_reference` 文件。原有程式已經可執行 HTML5 Canvas 平台遊戲的基礎內容，包括角色左右移動與跳躍、簡單平台碰撞、一隻敵人、問號磚、蘑菇、分數/生命/計時 UI 與背景音樂；之後我再依作業要求把最終提交整理成 Cocos Creator 2.4.8 專案與其 Web 輸出。

我以這份可執行初版為基礎，先整理完整作業簡報與繳交目標，再決定以「單一完整關卡、直接可讀的 Canvas / JavaScript 邏輯、容易自行操作驗證」的方向完成作品，並在最後轉入 Cocos Creator 2.4.8 的專案輸出與部署流程。Codex 是在我指定需求後，協助我檢查缺漏、擴充遊戲畫面與主要程式、整理文件以及執行測試與 Firebase 部署。由於 `index.html`、`style.css` 與 `main.js` 的最終擴充版本有 Codex 實質協助，本專案誠實標示為 AI-assisted implementation。

### 我在 AI 協作前已完成或準備的基礎

- 建立可執行的 Web Mario 初版網頁專案與目錄結構，後續再轉入 Cocos Creator 2.4.8 專案與輸出流程。
- 建立初版 Canvas 遊戲邏輯：玩家移動/跳躍、重力與平台碰撞、敵人接觸、問號磚與蘑菇、生命/分數/時間顯示。
- 準備遊戲所需的圖像與音訊素材，並在初版串接 BGM 與事件音效。
- 準備初版 README 與 AI reference 文件，作為繳交文件的基礎，之後再補上 Cocos Creator 版本的繳交說明。

### 我主導的需求整理與實作取捨

- 準備作業題目簡報與既有 Web Mario 初版專案，作為後續實作與比對評分項目的基礎。
- 指定必須逐項補齊遊戲流程、物理互動、音效、UI、Firebase 發布、README、checksum 與 repository 繳交需求。
- 選擇延續既有 HTML5 Canvas / plain JavaScript 架構，不額外引入複雜框架，讓程式可直接閱讀、修改與展示。
- 選擇以一個能從開始玩到過關的完整關卡涵蓋主要評分項目，而不是堆疊難以驗證的附加功能。
- 要求 AI reference 以中文清楚描述既有基礎、協作範圍及我必須理解與驗收的部分。

### 我負責的驗收與繳交確認

- 實際遊玩線上版本，確認操作、碰撞、關卡完成與失敗流程符合自己的理解。
- 確認最後上傳 FTP 的 ZIP 與填入 Google 表單的 MD5 checksum 完全一致。
- 確認 GitHub / GitLab repository URL、Firebase 遊戲網址與 eeclass 繳交內容正確。
- 能在 demo 或評分時說明 `main.js` 的狀態切換、碰撞判定、敵人踩踏及蘑菇變身邏輯。

## AI 使用範圍

| 區塊 | 檔案與行號 | AI 協助內容 | 我的既有基礎、取捨與驗收方式 |
| --- | --- | --- | --- |
| 作業評分需求整理 | `2026(Spring)_SS-Assignment_02_Web Mario.pptx`、`README.md` 全檔 | 我提供課程簡報與原始作業脈絡，Codex 協助我整理必做項目、Firebase bonus 與繳交檢查事項。 | 我先確認評分重點與繳交要求，再把 README checklist 當作最後逐項驗收依據。 |
| 網頁結構與遊戲流程 UI | `index.html` 第 1-73 行、`style.css` 第 1-252 行 | Codex 在我原本的 Canvas 頁面基礎上，協助擴充主選單、選關、操作說明、HUD、暫停、過關與失敗畫面，並調整外觀。 | 我的初版已存在 Canvas 與 HUD；擴充後由我檢查每個畫面是否能依玩家狀態正確切換，並符合 complete game process。 |
| 關卡資料與遊戲狀態 | `main.js` 第 1-216 行 | Codex 協助將短場景擴充成橫向關卡，加入平台/洞穴/樓梯、問號磚、敵人出生點、終點旗桿與狀態切換。 | 我選擇維持單一完整世界與容易說明的座標陣列形式，讓關卡可由我自行調整並在 demo 時說明。 |
| 玩家物理、碰撞與問號磚 | `main.js` 第 218-290 行 | Codex 在初版物理互動上補強水平/垂直碰撞、跳躍與由下方撞磚觸發獎勵的判定。 | 我的初版已有玩家移動、重力與方塊概念；提交前我可用跳躍撞磚確認道具只生成一次、分數正確增加。 |
| 敵人、蘑菇、受傷與重生 | `main.js` 第 291-364 行 | Codex 補齊多隻移動敵人、踩頭擊殺、蘑菇成長、受傷縮小、無敵時間、掉落扣命及重生流程。 | 這些互動直接對應 Player / Enemies / Question Blocks 評分；判斷方式為向下踩到敵人頭部才得分，側撞則受傷。 |
| 計時、相機與完成關卡 | `main.js` 第 366-399 行 | Codex 加入倒數計時、終點偵測、剩餘時間加分與跟隨玩家的水平相機。 | 我可在 HUD 觀察時間與分數，向右行進確認背景/關卡移動以及到旗桿後的過關結果畫面。 |
| Canvas 外觀與動畫 | `main.js` 第 401-564 行 | Codex 使用 Canvas 圖形繪製天空、雲、地形、角色、敵人、蘑菇與旗桿，加入走路腳步、敵人移動、磚塊彈跳與浮動分數動畫。 | 畫面維持簡單而易說明的原創組合方式；不需要匯入外部遊戲程式即可展示動畫與 appearance 項目。 |
| 鍵盤與音效控制 | `main.js` 第 566-605 行 | Codex 補齊暫停與靜音操作，並沿用專案原有 `audio/` 素材播放 BGM 與事件音效。 | 初版專案中已有音效素材與 BGM 串接；提交前我可透過跳躍、踩敵與切換音效確認 BGM 不被效果音取代。 |
| Firebase Hosting 部署 | `.firebaserc` 全檔、`firebase.json` 全檔 | Codex 協助建立 Hosting 設定並發布網站，另修正 `.git` 與 `.firebase` 不應被公開部署的排除規則。 | Firebase 專案與發布需求由我提供；公開網址為 `https://software-studio-c09b0.web.app`，我負責將正確網址與最終檔案提交至課程平台。 |
| README 與 AI reference | `README.md` 全檔、`AI_reference.md` 全檔、`AI_reference.pdf` 全檔 | Codex 依作業規格整理操作方式、功能對照、部署資訊及 AI 使用紀錄，並輸出 PDF。 | 我依照真實開發流程保留 AI 使用揭露，不將 AI 大幅重寫的程式宣稱為完全自行完成。 |

## Prompt 與 Response 紀錄

以下紀錄以本次專案協作中的實際用途整理。若課程要求逐字對話截圖，可再以原始 Codex 對話畫面作為附件佐證。

### 1. 作業需求盤點與現有程式檢查

Prompt：

```text
作業題目全文與評分標準都在 2026(Spring)_SS-Assignment_02_Web Mario，
已經有寫了一部份程式碼，允許直接在工作區修改檔案。
幫我根據要求完成作業，並完成 Firebase deploy、README、
FTP / checksum / GitHub 或 GitLab / eeclass 等繳交流程。
```

AI Response 摘要：

```text
Codex 先讀取投影片與既有 index.html、style.css、main.js，
確認初版已有簡單平台遊戲，但缺少完整遊戲流程、選關、橫向捲動關卡、
穩定的過關/失敗狀態與正式部署設定。Codex 建議先補齊核心評分功能，
再驗證網站並處理文件與繳交流程。
```

我的主導內容與確認：

- 我提供作業規格與已寫的一部分程式作為修改基礎，並先界定哪些地方可以保留、哪些必須補齊。
- 我指定需完成 Firebase、README、checksum、repository 與 eeclass 等正式繳交流程。
- 我選擇保留單一世界並使其能完整遊玩與展示，以對照簡報中的基本評分項目。
- 我依 README 的評分 checklist 逐項實際操作確認結果，決定哪些地方已達標、哪些地方仍要修正。

### 2. 完整遊戲流程與關卡實作

Prompt：

```text
依照 Web Mario 作業評分項目，在既有 HTML5 Canvas 平台遊戲上補齊：
start menu、level select、game view、game over、物理碰撞、相機捲動、
問號磚、蘑菇、敵人踩踏、生命、分數與 timer。
```

AI Response 摘要：

```text
Codex 將頁面改成具有 menu、level-select、playing、paused、
course-clear 與 game-over 狀態的介面；在 main.js 中用矩形平台陣列
建立一條可捲動的長關卡，加入洞穴、樓梯、問號磚、蘑菇、多隻敵人與旗桿。
碰撞採水平與垂直分開解決的方式，只有玩家由上往下落在敵人頭上時才會擊敗敵人。
```

我的既有基礎、取捨與確認：

- 初版程式已有 Canvas、基本重力、玩家移動、敵人與蘑菇的雛形，我以此作為整體擴充的起點。
- 最終關卡仍使用簡單的座標陣列，邏輯較容易逐段閱讀與自行修改。
- 我可操作角色撞問號磚、取得蘑菇、踩敵人、掉入洞穴與抵達旗桿來檢查功能。

### 3. 動畫、音效與 UI

Prompt：

```text
補齊評分中的 animations、sound effects 與 UI。
音效播放時不能中斷背景音樂，畫面需要能顯示 life、score 與 timer。
```

AI Response 摘要：

```text
Codex 以 Canvas 圖形建立簡單角色及關卡外觀，加入角色走路、
敵人腳步、問號磚彈跳、浮動分數與移動背景效果。
音訊方面使用持續循環的 BGM audio object，事件發生時另外建立
效果音 audio object，因此兩者可以同時播放；HUD 顯示分數、金幣、
生命、世界與倒數時間。
```

我的既有基礎與驗收方式：

- 原資料夾已有 BGM 與多個事件音效檔，可沿用為作業素材。
- 我可在遊戲畫面確認 HUD 變動，並在跳躍、受傷、踩敵人與過關時聽取效果音。
- `M` 鍵與畫面按鈕可切換聲音，`P` 鍵可暫停/繼續遊戲。

### 4. Firebase Hosting 與公開網址

Prompt：

```text
將完成的網頁以 Firebase Page deploy，並確認線上網址可以正常開啟遊戲。
```

AI Response 摘要：

```text
Codex 找到已登入的 Firebase 專案 `software-studio-c09b0`，
建立 `.firebaserc` 與 `firebase.json`，將靜態網站發布到
https://software-studio-c09b0.web.app。部署後又發現 Git repository
metadata 曾被包含於發布檔案，因此補上排除規則並重新部署，
確認 `/.git/HEAD` 在線上回傳 404。
```

我的部署責任與確認：

- Firebase 專案屬於我的提交環境，最終網址由我提交至 eeclass。
- 我會在正式繳交前再打開線上網址完整遊玩一次，避免只驗證首頁而漏掉遊戲流程。

### 5. README 與 AI reference 整理

Prompt：

```text
請依作業要求撰寫 README.md，並將 AI_reference 改成繁體中文，
包含工具名稱、AI 使用範圍、Prompt / Response 摘要與我原本已有的實作基礎；
AI 使用內容需誠實揭露。
```

AI Response 摘要：

```text
Codex 整理 README 的遊戲操作方式、規格對照、檔案用途、
驗證結果與 Firebase 網址；AI_reference 則依照本次協作紀錄，
列出既有 prototype、AI 大幅協助重寫的檔案區段、測試與部署工作，
並輸出課程要求的 PDF 文件。
```

我的調整與確認：

- 我要求文件採用先前作業使用過的中文整理格式，以方便 TA 閱讀。
- 我保留「原本已有初版程式」以及「最終版本受到 AI 大幅協助」兩項事實，避免 AI disclosure 與實際檔案修改情形不一致。
- 在完成 FTP、MD5 表單、repository 與 eeclass 上傳後，我會確認 README 的繳交資訊與實際提交資料一致。

## 總結

本專案在本次 AI 協作前已由我準備一個可執行的 Web Mario 初版，包含 Canvas 平台遊戲、玩家控制、基本互動、HUD、音效素材及初版文件。我先提供作業規格與提交目標，並選擇以單一完整關卡與容易理解的原生 JavaScript 架構延續實作；本次 Codex 則在我的需求與驗收條件下協助我把初版對齊 Cocos Creator 2.4.8 的作業要求、檢查與發布 Firebase Hosting，以及整理提交文件。

最終提交的 `index.html`、`style.css`、`main.js` 與文件是在我的初版專案、功能目標與繳交需求之上完成的 AI-assisted work，因此本報告直接揭露協助範圍，而不省略既有成果或誇大個人修改。我負責在繳交前親自檢查遊戲功能、理解主要程式邏輯、確認 ZIP / MD5 / FTP / repository / eeclass 資訊一致，並以真實執行結果完成提交。
