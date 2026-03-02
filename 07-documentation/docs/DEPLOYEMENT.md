# Task Manager API 生產環境部署指南

---

## 1. 環境需求與依賴

- Node.js 16 以上（建議 LTS 版本）
- npm/yarn 套件管理工具
- 建議搭配正式資料庫（如 MongoDB、PostgreSQL）
- 建議 Linux (Ubuntu 20.04+) 或雲端主機
- Docker（如採用容器化）

### 主要依賴
- express
- jsonwebtoken
- bcrypt

---

## 2. 環境變數設定

請於專案根目錄建立 `.env` 檔案，內容範例：
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your_strong_secret
DB_URL=mongodb://user:pass@host:port/dbname # 若接資料庫
```
- 請勿將 `.env` 檔案提交至版本控制
- JWT_SECRET 務必設為高強度隨機字串

---

## 3. Docker 部署方案

### Dockerfile 範例
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "taskManager.js"]
```

### 建立與啟動容器
```bash
docker build -t task-manager-api .
docker run -d --env-file .env -p 3000:3000 task-manager-api
```

---

## 4. 雲端部署步驟

### AWS EC2
1. 建立 EC2 Ubuntu 主機，開啟 3000 port
2. 安裝 Node.js、git、Docker（可選）
3. clone 專案、設定 .env
4. `npm install` 或 `docker build ...`
5. 使用 `pm2` 或 `docker` 啟動服務
6. 建議搭配 Nginx 反向代理與 HTTPS

### Azure App Service
1. 建立 Node.js Web App
2. 設定環境變數（Application settings）
3. 部署程式碼（GitHub Actions、FTP、zip）
4. 設定啟動命令：`node taskManager.js`
5. 可選：使用 Azure Cosmos DB/MongoDB

---

## 5. 監控與日誌設置

- **監控**：建議整合 Prometheus、Grafana、Datadog、NewRelic 等
- **健康檢查**：可加設 `/health` 路由供 Load Balancer 檢查
- **日誌**：
  - 本地：可用 `winston`、`morgan` 等記錄請求與錯誤
  - Docker：建議將 log 輸出至 stdout/stderr，方便集中收集
  - 雲端：可串接 AWS CloudWatch、Azure Monitor
- **警報**：設定異常通知（如 CPU、記憶體、錯誤率過高）

---

如需資料庫連線、CI/CD、進階安全設計，請依實際需求擴充。
