# CLAUDE.md — 香郎津桃 saigontrapboy.github.io

## 多人協作：每次修改前必須同步遠端

這是多人協作的專案，遠端倉庫為：
`https://github.com/SaigonTrapBoy/saigontrapboy.github.io.git`

**每次開始修改任何檔案之前，必須先執行以下步驟：**

1. 確認目前分支是否有未提交的變更：
   ```
   git status
   ```
2. 拉取 GitHub 最新版本，與遠端同步：
   ```
   git pull origin main
   ```
3. 確認無衝突後，再開始修改。

若 `git pull` 發生合併衝突，需先解衝突再繼續作業，不可強制覆蓋。

## 提交規範

- 修改完成後，commit 訊息使用繁體中文描述變更內容。
- 確認無誤後再 push，未經使用者確認不主動 push。
