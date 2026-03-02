const express = require("express")
const path = require("path")
const app = express()
const PORT = 3001

// 提供覆蓋率報告
app.use("/coverage", express.static(path.join(__dirname, "../coverage/lcov-report")))
// 提供效能測試報告
app.use("/performance", express.static(path.join(__dirname, "../performance")))

app.get("/", (req, res) => {
  res.send(`
    <h1>測試自動化 Dashboard</h1>
    <ul>
      <li><a href="/coverage/index.html" target="_blank">單元/整合測試覆蓋率報告</a></li>
      <li><a href="/performance/report.html" target="_blank">效能測試報告</a></li>
    </ul>
  `)
})

app.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`)
})
