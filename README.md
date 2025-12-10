# English Practice — 單字測驗

簡單的前端範例，用來根據「字義」測驗使用者填寫「詞性」與「單字」。

## 目錄
- [快速開始](#快速開始)
- [檔案說明](#檔案說明)
- [後端使用（伺服器模式）](#後端使用伺服器模式)
- [跨電腦使用（GitHub）](#跨電腦使用github)

## 快速開始

### 方式 1：本機純前端模式（無需伺服器）

適合單機使用，資料存在瀏覽器。

1. 在瀏覽器打開 `index.html`（直接雙擊或用簡單伺服器 `python -m http.server 8000`）。
2. 點選「新增單字」加入詞彙。
3. 點選「開始測驗」進行測驗。

**優點**：無需安裝、無伺服器。  
**缺點**：資料只在該瀏覽器存，換電腦會遺失。

### 方式 2：本機後端模式（推薦）

需要 Node.js，資料存在伺服器，可用「管理單字」界面管理題庫。

1. **安裝相依套件**（第一次執行）：
   ```powershell
   npm install
   ```

2. **啟動伺服器**：
   ```powershell
   node server.js
   ```
   伺服器會在 `http://localhost:3000` 啟動。

3. **在瀏覽器打開**：
   - 主頁：http://localhost:3000/index.html
   - 新增單字：http://localhost:3000/add.html
   - 開始測驗：http://localhost:3000/quiz.html
   - 管理單字（勾選要出題的項目）：http://localhost:3000/manage.html

**流程**：
- 在「新增單字」頁輸入詞彙 → 會同時寫到伺服器與瀏覽器。
- 在「管理單字」頁勾選要出題的詞彙 → 按「儲存變更」。
- 在「開始測驗」頁做題 → 會優先使用伺服器的 active 詞彙。

## 檔案說明

**前端檔案**
- `index.html`：主頁（顯示詞彙數、導向測驗/新增/管理）
- `quiz.html`：測驗頁面（根據字義填寫詞性與單字）
- `add.html`：新增單字頁面
- `manage.html`：管理單字頁面（勾選、全選、刪除、儲存）
- `styles.css`：樣式檔
- `app.js`：JavaScript 工具集（localStorage 與答案比對邏輯）

**後端檔案**
- `server.js`：Express API 伺服器
- `package.json`：Node.js 依賴清單
- `data/words.json`：詞庫資料檔

## 後端使用（伺服器模式）

### API 端點

若伺服器啟動（`node server.js`），可用以下 API：

```powershell
# 取得所有詞彙
GET http://localhost:3000/api/words

# 只取得 active=true 的詞彙（用於測驗）
GET http://localhost:3000/api/words?active=true

# 新增詞彙
POST http://localhost:3000/api/words
# 請求 body: {"word":"單字","pos":"詞性","def":"字義","sample":false}

# 更新詞彙（例如改 active 狀態）
PUT http://localhost:3000/api/words/[id]
# 請求 body: {"active":true}

# 刪除詞彙
DELETE http://localhost:3000/api/words/[id]
```

### 用 PowerShell 測試 API

```powershell
# 取得所有詞彙
Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/words | ConvertTo-Json

# 新增一個詞彙
$body = @{word="acquire";pos="verb";def="獲得、取得";sample=$false} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/words -ContentType 'application/json' -Body $body

# 只取得 active 的詞彙（測驗用）
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/words?active=true" | ConvertTo-Json
```

## 跨電腦使用（GitHub）

### 上傳到 GitHub

1. **初始化 Git 倉庫**（如果還未初始化）：
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **新增遠端倉庫**（假設你已在 GitHub 建立 English_practice repo）：
   ```powershell
   git remote add origin https://github.com/你的名稱/English_practice.git
   git branch -M main
   git push -u origin main
   ```

3. **之後每次更新**：
   ```powershell
   git add .
   git commit -m "更新詞彙"
   git push
   ```

### 在另一台電腦下載並使用

1. **Clone 專案**：
   ```powershell
   git clone https://github.com/你的名稱/English_practice.git
   cd English_practice
   ```

2. **安裝依賴**：
   ```powershell
   npm install
   ```

3. **啟動伺服器**：
   ```powershell
   node server.js
   ```

4. **在瀏覽器打開**：
   http://localhost:3000/index.html

### 資料同步

- `data/words.json`：所有詞彙與狀態都儲存在這個檔案裡。  
- 每次修改詞彙（新增、刪除、改 active 狀態），伺服器會自動更新 `data/words.json`。  
- 若要同步到 GitHub，只需執行 `git push`。

## 常見問題

**Q1：為什麼在 GitHub Pages 上用不了？**  
A：因為後端是 Node.js，GitHub Pages 只支援靜態檔案。若要雲端化，需把後端部署到 Vercel/Railway 等平台。

**Q2：資料會不會遺失？**  
A：
- **本機後端模式**：資料存在 `data/words.json` 與伺服器，push 到 GitHub 即可備份。
- **純前端模式**：資料只在瀏覽器 localStorage，清除會遺失（建議定期備份）。

**Q3：可以在手機上用嗎？**  
A：
- **純前端模式**：可以（只要用瀏覽器打開 HTML 檔案）。
- **後端模式**：需要同一個 WiFi 網路，手機訪問 `http://[電腦IP]:3000`（但目前需手動修改伺服器設定支援跨域）。

**Q4：怎麼清除所有詞彙重新來？**  
A：
- **本機後端**：刪除 `data/words.json` 裡的內容或用「管理單字」逐一刪除。
- **純前端**：在「新增單字」頁按「清除所有單字」或在開發者工具清除 localStorage。


 
