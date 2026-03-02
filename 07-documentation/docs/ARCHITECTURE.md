# Task Manager API 系統架構文件

---

## 1. 系統總覽架構圖（ASCII Art）

```
+-------------------+         +-------------------+
|   Client (前端)   | <-----> |   Express Router  |
+-------------------+         +-------------------+
                                      |
                                      v
+---------------------------------------------------+
|                TaskManager API                    |
|  +-----------+   +-----------+   +-------------+ |
|  |  Users    |   |  Tasks    |   |  Projects   | |
|  +-----------+   +-----------+   +-------------+ |
|        \             |                /           |
|         +------------+---------------+           |
|                  In-Memory DB                    |
+---------------------------------------------------+
```

---

## 2. 資料模型規格

### User
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "password": "hash",
  "createdAt": "ISO8601",
  "role": "user",
  "updatedAt": "ISO8601"
}
```

### Task
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "pending|in_progress|completed",
  "priority": "high|medium|low",
  "projectId": 1,
  "assigneeId": 1,
  "creatorId": 1,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "dueDate": "ISO8601",
  "tags": [],
  "comments": [ { ...comment } ],
  "attachments": []
}
```

### Project
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "ownerId": 1,
  "members": [1,2],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "settings": {
    "isPublic": false,
    "allowGuestAccess": false
  }
}
```

### Comment
```json
{
  "id": 1,
  "userId": 1,
  "content": "string",
  "createdAt": "ISO8601"
}
```

---

## 3. API 操作流程圖

### 用戶註冊/登入流程
```
Client
  |
  | POST /api/users/register 或 /login
  v
Express Router
  |
  |---> 檢查資料/驗證密碼/產生 JWT
  v
回傳註冊/登入結果（含 token）
```

### 任務建立與查詢流程
```
Client
  |
  |--(帶 JWT)--> POST /api/tasks
  v
Express Router (auth)
  |
  |---> 新增任務至 db.tasks
  v
回傳任務資料

Client
  |
  |--(帶 JWT)--> GET /api/tasks
  v
Express Router (auth)
  |
  |---> 查詢 db.tasks，依條件過濾
  v
回傳任務列表
```

---

## 4. 安全機制概述

- **JWT 驗證**：所有敏感 API 需帶 JWT，於 `Authorization: Bearer <token>`
- **密碼雜湊**：用戶密碼以 bcrypt 雜湊儲存
- **權限控管**：
  - 任務僅限 assignee/creator 可編輯，僅 creator 可刪除
  - 項目僅 owner 可新增成員
  - 項目任務僅成員可查詢
- **錯誤處理**：所有錯誤皆回傳標準格式，避免洩漏敏感資訊
- **環境變數**：JWT_SECRET 建議以環境變數管理

---

## 5. 可擴展性與延展性設計

- **模組化路由**：所有 API 以 Express Router 分層，便於拆分與擴充
- **中間件機制**：認證、驗證、錯誤處理皆以中間件實作，可彈性插拔
- **資料庫抽象**：目前為記憶體資料庫，未來可輕鬆替換為 MongoDB、PostgreSQL 等
- **資料驗證**：validate 支援 Joi schema，便於擴充欄位與驗證規則
- **API 文件自動化**：JSDoc 註解可自動產生 API 文件，利於團隊協作
- **可整合測試**：結構簡單，易於導入 Jest/Supertest 進行自動化測試

---

如需更詳細 API 規格，請參閱 `docs/API.md`。
