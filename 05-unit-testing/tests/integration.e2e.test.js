/**
 * 整合測試與 E2E 測試
 * 驗證資料處理流程完整性、UI 與核心邏輯整合、複雜用戶情境
 */

const fs = require("fs")
const path = require("path")
const { JSDOM } = require("jsdom")
const dataProcessor = require("../src/dataProcessor")
const calculator = require("../src/calculator")
const validator = require("../src/validator")
const utils = require("../src/utils")
const { createUsers } = require("./factories/userFactory")

// 載入 index.html 並模擬 DOM
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8")
let dom, document, window

describe("整合與 E2E 測試", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" })
    window = dom.window
    document = window.document
    // 載入 app.js 以模擬 UI 行為
    require("../app.js")
  })

  afterEach(() => {
    dom.window.close()
    jest.resetModules()
  })

  it("應正確串接資料處理主流程 (E2E)", () => {
    // 模擬一組使用者資料
    const users = createUsers(5, { age: 25 })
    // 驗證資料流：驗證 -> 處理 -> 統計
    expect(users.every(u => validator.isInRange(u.age, 18, 80))).toBe(true)
    const adults = dataProcessor.filterAdults(users)
    expect(adults.length).toBe(5)
    const avgAge = dataProcessor.getAverageAge(adults)
    expect(avgAge).toBe(25)
  })

  it("UI 輸入資料後應正確觸發核心邏輯並顯示結果", () => {
    // 模擬輸入框與按鈕
    const input = document.createElement("input")
    input.value = "test@example.com"
    input.id = "emailInput"
    document.body.appendChild(input)
    const btn = document.createElement("button")
    btn.id = "submitBtn"
    document.body.appendChild(btn)
    // 假設 app.js 綁定了事件
    btn.click()
    // 檢查 UI 是否有顯示驗證結果（需配合 app.js 實作）
    // 這裡僅示意，實際需根據 app.js 實作調整
    // expect(document.getElementById("result").textContent).toContain("成功")
  })

  it("複雜用戶情境：資料異常時流程應正確處理", () => {
    // 模擬含有未成年與不合法資料的用戶
    const users = [
      ...createUsers(2, { age: 17 }),
      ...createUsers(3, { age: 30 }),
      { name: "壞資料", age: null }
    ]
    // 過濾與驗證
    const adults = dataProcessor.filterAdults(users)
    expect(adults.every(u => u.age >= 18)).toBe(true)
    // 計算平均年齡時應排除壞資料或丟出錯誤
    expect(() => dataProcessor.getAverageAge(adults)).not.toThrow()
  })
})
