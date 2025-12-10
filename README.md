# English Practice — 單字測驗

簡單的前端範例，用來根據「字義」測驗使用者填寫「詞性」與「單字」。

檔案說明：

- `index.html`：主頁，顯示單字數並導向其他頁面。
- `quiz.html`：測驗頁面，顯示字義並讓使用者輸入答案。
- `add.html`：新增單字頁面，可將單字、詞性與字義儲存在瀏覽器。
- `styles.css`：樣式檔。
- `app.js`：處理 localStorage 與簡單比對邏輯。

使用方式：

1. 在瀏覽器中打開 `index.html`（直接雙擊或用本地伺服器開啟皆可）。
2. 前往 `新增單字`（`add.html`）加入單字或使用預設的範例單字。
3. 點選 `開始測驗`（`quiz.html`）進行測驗。

資料儲存：

單字儲存在瀏覽器的 `localStorage`（key = `vocabList_v1`）。若要清除，可在 `add.html` 使用「清除所有單字」按鈕，或在瀏覽器開發者工具中清除 `localStorage`。

 
