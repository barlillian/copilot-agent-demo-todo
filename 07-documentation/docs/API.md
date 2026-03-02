# Task Manager API 參考文件

本文件詳細說明 `07-documentation/taskManager.js` 所實作的所有 API 端點、請求/回應格式、錯誤碼、認證需求與範例。

---

## 認證說明

- 除註冊與登入外，所有 API 皆需 JWT 驗證。
- 請於 HTTP Header 加入：
  ```
  Authorization: Bearer <token>
  ```
- Token 由 `/api/users/login` 取得。

---

## 錯誤碼說明

| 狀態碼 | 說明                       |
|--------|----------------------------|
| 400    | 請求參數錯誤               |
| 401    | 未授權/Token 無效           |
| 403    | 權限不足                   |
| 404    | 資源不存在                 |
| 409    | 資源衝突（如用戶已存在）   |
| 500    | 伺服器內部錯誤             |

回應格式：
```json
{
  "error": "錯誤描述"
}
```

---

## 用戶相關 API

### 註冊
- **POST** `/api/users/register`
- **認證**：不需
- **Body**：
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "createdAt": "2026-03-01T12:00:00.000Z",
    "role": "user"
  }
}
```
- **錯誤**：400 缺欄位、409 用戶已存在

---

### 登入
- **POST** `/api/users/login`
- **認證**：不需
- **Body**：
```json
{
  "email": "string",
  "password": "string"
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com",
      "createdAt": "2026-03-01T12:00:00.000Z",
      "role": "user"
    }
  }
}
```
- **錯誤**：401 帳密錯誤

---

### 取得個人資料
- **GET** `/api/users/profile`
- **認證**：需
- **成功回應**：同註冊回應格式
- **錯誤**：404 用戶不存在

---

### 更新個人資料/密碼
- **PUT** `/api/users/profile`
- **認證**：需
- **Body**（可選）：
```json
{
  "username": "string",
  "email": "string",
  "currentPassword": "string", // 修改密碼時必填
  "newPassword": "string"
}
```
- **成功回應**：同註冊回應格式
- **錯誤**：401 密碼錯誤、404 用戶不存在

---

## 任務相關 API

### 查詢任務
- **GET** `/api/tasks`
- **認證**：需
- **Query 參數**：
  - `page` (預設 1)
  - `limit` (預設 10)
  - `status` (optional)
  - `priority` (optional)
  - `projectId` (optional)
  - `search` (optional)
- **成功回應**：
```json
{
  "success": true,
  "data": [ { ...task } ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```
- **錯誤**：無

---

### 建立任務
- **POST** `/api/tasks`
- **認證**：需
- **Body**：
```json
{
  "title": "string",
  "description": "string",
  "priority": "high|medium|low", // 預設 medium
  "projectId": 1, // optional
  "dueDate": "2026-03-10T00:00:00.000Z" // optional
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": { ...task }
}
```
- **錯誤**：400 缺標題

---

### 更新任務
- **PUT** `/api/tasks/:id`
- **認證**：需（限 assignee/creator）
- **Body**（可選）：
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in_progress|completed",
  "priority": "high|medium|low",
  "dueDate": "2026-03-10T00:00:00.000Z",
  "assigneeId": 2
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": { ...task }
}
```
- **錯誤**：403 權限不足、404 任務不存在

---

### 刪除任務
- **DELETE** `/api/tasks/:id`
- **認證**：需（限 creator）
- **成功回應**：
```json
{
  "success": true,
  "message": "Task deleted"
}
```
- **錯誤**：403 權限不足、404 任務不存在

---

### 任務留言
- **POST** `/api/tasks/:id/comments`
- **認證**：需
- **Body**：
```json
{
  "content": "string"
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "content": "留言內容",
    "createdAt": "2026-03-01T12:00:00.000Z"
  }
}
```
- **錯誤**：404 任務不存在

---

## 項目相關 API

### 查詢參與項目
- **GET** `/api/projects`
- **認證**：需
- **成功回應**：
```json
{
  "success": true,
  "data": [ { ...project } ]
}
```

---

### 建立項目
- **POST** `/api/projects`
- **認證**：需
- **Body**：
```json
{
  "name": "string",
  "description": "string"
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": { ...project }
}
```
- **錯誤**：400 缺名稱

---

### 查詢項目任務
- **GET** `/api/projects/:id/tasks`
- **認證**：需（限成員）
- **成功回應**：
```json
{
  "success": true,
  "data": [ { ...task } ]
}
```
- **錯誤**：403 權限不足、404 項目不存在

---

### 新增項目成員
- **POST** `/api/projects/:id/members`
- **認證**：需（限 owner）
- **Body**：
```json
{
  "userId": 2
}
```
- **成功回應**：
```json
{
  "success": true,
  "data": { ...project }
}
```
- **錯誤**：403 權限不足、404 項目/用戶不存在

---

## 統計 API

### 任務統計資訊
- **GET** `/api/stats/dashboard`
- **認證**：需
- **成功回應**：
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 3,
    "pendingTasks": 5,
    "inProgressTasks": 2,
    "overdueTasks": 1,
    "tasksByPriority": {
      "high": 2,
      "medium": 6,
      "low": 2
    },
    "recentActivity": [ { ...task } ]
  }
}
```

---

## 資料結構說明

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

## 備註
- 所有日期皆為 ISO8601 格式
- 欄位如未標註為必填則為選填
- 權限不足、資源不存在等皆回傳標準錯誤格式

---

如需更多範例或有疑問，請參考原始碼或聯絡維護者。
