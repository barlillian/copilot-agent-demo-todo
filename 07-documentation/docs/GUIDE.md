# Task Manager API 開發者快速入門指南

---

## 1. 系統概述與功能

Task Manager API 是一套以 Express.js 實作的任務管理後端，支援：
- 用戶註冊、登入、個人資料與密碼管理
- 任務的建立、查詢、更新、刪除、留言
- 項目的建立、成員管理、任務查詢
- 任務統計資訊查詢
- JWT 驗證與權限控管
- 完全以記憶體模擬資料庫，適合教學與原型開發

---

## 2. 環境建置步驟

1. **安裝 Node.js（建議 v16+）**
2. **安裝專案依賴**
   ```bash
   npm install express jsonwebtoken bcrypt
   ```
3. **（可選）設定環境變數**
   - 建議於 `.env` 設定：
     ```
     JWT_SECRET=your_strong_secret
     NODE_ENV=development
     ```
4. **啟動伺服器**
   ```bash
   node 07-documentation/taskManager.js
   ```
   > 實際專案應將 router 掛載於主 Express app

---

## 3. 認證流程說明

- 用戶註冊後，透過 `/api/users/login` 取得 JWT token。
- 後續所有需驗證 API，HTTP Header 必須加上：
  ```
  Authorization: Bearer <token>
  ```
- Token 失效或遺失時，需重新登入取得。
- 權限控管：部分操作僅限創建者、指派者或項目 owner 執行。

---

## 4. 常見端對端操作範例

### 註冊與登入
```bash
# 註冊
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"123456"}'

# 登入取得 token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"123456"}'
# 回應中 data.token 即為後續 API 所需 JWT
```

### 建立任務
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"寫文件","description":"完成 API 文件"}'
```

### 查詢任務
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

### 建立項目並新增成員
```bash
# 建立項目
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"新專案","description":"教學用"}'

# 新增成員（僅 owner 可執行）
curl -X POST http://localhost:3000/api/projects/1/members \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":2}'
```

### 查詢統計資訊
```bash
curl -X GET http://localhost:3000/api/stats/dashboard \
  -H "Authorization: Bearer <token>"
```

---

## 5. 最佳實踐建議

- **密碼與 JWT 秘鑰請勿硬編碼**，務必使用環境變數管理
- **API 請求皆需驗證回應格式與錯誤碼**，利於前端處理
- **開發時建議加上日誌與錯誤追蹤**，便於除錯
- **資料驗證建議採用 Joi 等 schema 驗證工具**
- **如需持久化，請改用資料庫（如 MongoDB、PostgreSQL）**
- **撰寫單元測試，確保 API 穩定性**
- **勿於生產環境使用預設 JWT_SECRET**

---

如需更詳細 API 規格，請參閱 `docs/API.md`。
