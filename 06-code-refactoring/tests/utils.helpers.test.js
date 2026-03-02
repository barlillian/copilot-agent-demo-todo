// 單元測試：helpers.js
const { deepCopy, formatDate, generateSKU } = require("../src/utils/helpers")
describe("helpers.js 工具函數", () => {
  it("deepCopy 應正確複製物件", () => {
    const obj = { a: 1, b: { c: 2 } }
    const copy = deepCopy(obj)
    expect(copy).toEqual(obj)
    expect(copy).not.toBe(obj)
    expect(copy.b).not.toBe(obj.b)
  })
  it("formatDate 應正確格式化日期", () => {
    const d = new Date("2024-01-02T03:04:05")
    expect(formatDate(d)).toBe("2024-01-02 03:04:05")
  })
  it("generateSKU 應產生正確格式", () => {
    const sku = generateSKU("筆記型電腦", "電子");
    expect(typeof sku).toBe("string")
    expect(sku.length).toBeGreaterThanOrEqual(10)
  })
})
